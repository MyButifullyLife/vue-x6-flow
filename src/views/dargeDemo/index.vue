<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container">
        <header>
          <el-tooltip
            class="item"
            effect="dark"
            content="长按shift多选"
            placement="bottom"
          >
            <i class="el-icon-crop" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="放大"
            placement="bottom"
          >
            <i class="el-icon-zoom-in" @click="zoomFn(0.2)" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="缩小"
            placement="bottom"
          >
            <i class="el-icon-zoom-out" @click="zoomFn(-0.2)" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="适应屏幕"
            placement="bottom"
          >
            <i class="el-icon-full-screen" @click="centerFn" />
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="保存"
            placement="bottom"
          >
            <i class="el-icon-upload" @click="saveFn()" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="加载保存页面"
            placement="bottom"
          >
            <i class="el-icon-link" @click="loadFn()" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="是否禁用"
            placement="bottom"
          >
            <i
              :class="{ 'el-icon-lock': isLock, 'el-icon-unlock': !isLock }"
              @click="lockFn()"
            />
          </el-tooltip>
        </header>
        <div id="draw-cot" />
      </div>
    </section>
  </div>
</template>

<script>
import "@antv/x6-vue-shape";
import GraphMixin from "./graphMixin";
import { dataJson, generateUniqueId } from "./config";
import { DagreLayout } from "@antv/layout";

export default {
  name: "App",
  mixins: [GraphMixin],
  data() {
    return {
      graph: "",
      timer: "",
      isLock: false,
      showContextMenu: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getNodeById(id) {
      return this.graph.getCellById(id);
    },

    createNodeByJson(d) {
      return {
        id: `${d.id}`,
        shape: "dag-common",
        data: d.data,
        width: 180,
        height: 40,
        ports: {
          groups: {
            left: {
              position: "left",
              attrs: {
                circle: {
                  stroke: "transparent",
                  strokeWidth: 0,
                  fill: "transparent",
                },
              },
            },

            right: {
              position: "right",
              attrs: {
                circle: {
                  stroke: "transparent",
                  strokeWidth: 0,
                  fill: "transparent",
                },
              },
            },
          },
          items: [
            {
              id: `left-${d.id}`,
              group: "left", // 指定分组名称
            },
            {
              id: `right-${d.id}`,
              group: "right", // 指定分组名称
            },
          ],
        },
      };
    },
    createEdgeByJson(d, nextItem) {
      return {
        source: { cell: d.id, port: "right-" + d.id },
        target: { cell: nextItem.id, port: "left-" + nextItem.id },
        shape: "dag-edge",
        labels: [
          {
            attrs: {
              line: {
                stroke: "#73d13d",
              },
            },
          },
        ],
      };
    },
    // 初始化节点/边
    init() {
      const formJson = {
        nodes: [],
        edges: [],
      };

      const fn = (d) => {
        formJson.nodes.push(this.createNodeByJson(d));
        if (d.children && d.children.length) {
          d.children.forEach((nextData) => {
            nextData.id = generateUniqueId();
            formJson.edges.push(this.createEdgeByJson(d, nextData));
            fn(nextData);
          });
        } else if (d.leafId) {
          formJson.edges.push(this.createEdgeByJson(d, { id: d.leafId }));
        }
      };

      dataJson.forEach((d) => {
        d.id = generateUniqueId();
        fn(d);
      });

      const dagreLayout = new DagreLayout({
        type: "dagre",
        rankdir: "LR",
        ranksep: 100,
        nodesep: 100,
      });

      console.log(formJson);
      const model = dagreLayout.layout(formJson);

      this.graph.fromJSON(model);
    },
    zoomFn(num) {
      this.graph.zoom(num);
    },
    centerFn() {
      const num = 1 - this.graph.zoom();
      num > 1 ? this.graph.zoom(num * -1) : this.graph.zoom(num);
      this.graph.centerContent();
    },

    createMenuFn() {},
    saveFn() {
      localStorage.setItem(
        "x6Json",
        JSON.stringify(this.graph.toJSON({ diff: true }))
      );
    },
    loadFn() {
      // this.timer && clearTimeout(this.timer);
      // const x6Json = JSON.parse(localStorage.getItem("x6Json"));
      // this.startFn(x6Json.cells);
    },
    lockFn() {
      this.isLock = !this.isLock;
      if (this.isLock) {
        this.graph.enablePanning();
        this.graph.enableKeyboard();
      } else {
        this.graph.disablePanning();
        this.graph.disableKeyboard();
      }
    },
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
}

header i {
  margin: 8px;
  font-size: 30px;
}
.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}

.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

.section-cot {
  display: flex;
}

.section-cot #container {
  position: relative;
  flex: 1;
}

.section-cot #container #draw-cot {
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0;
}
</style>
