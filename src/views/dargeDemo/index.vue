<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container">
        <header>
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
        </header>
        <div id="draw-cot" />
      </div>
    </section>
    <EditDialog ref="EditDialog" @change="nodeChange"></EditDialog>
  </div>
</template>

<script>
import "@antv/x6-vue-shape";
import GraphMixin from "./graphMixin";
import { dataJson, generateUniqueId, statusColor } from "./config";
import { DagreLayout } from "@antv/layout";

import EditDialog from "./components/drawer";

export default {
  name: "App",
  mixins: [GraphMixin],
  components: { EditDialog },
  data() {
    return {
      graph: "",
      timer: "",
      isLock: false,
      showContextMenu: false,
      dataJson: dataJson,
    };
  },
  beforeDestroy() {
    this.$EventBus.$off("DargeEditEvent", this.editEvent);
    this.$EventBus.$off("DargeEditChange", this.nodeChange);
  },
  mounted() {
    this.initLayout();
    this.$EventBus.$on("DargeEditEvent", this.editEvent);
    this.$EventBus.$on("DargeEditChange", this.nodeChange);
  },
  methods: {
    setDargeDemoDataJSON() {
      // drawer 页面需要用
      window.$DargeDemoDataJSON = this.dataJson;
    },
    findNodeByDataJson(id) {
      let item = "";
      const fn = (d) => {
        if (d.id === id) {
          item = d;
        } else {
          if (d.children && d.children.length) {
            d.children.forEach((nextData) => {
              fn(nextData);
            });
          }
        }
      };

      this.dataJson.forEach((d) => {
        fn(d);
      });

      return item;
    },
    updateId(target) {
      target = JSON.parse(JSON.stringify(target));

      target.id = generateUniqueId();
      const fn = (d) => {
        d.id = generateUniqueId();
        if (d.children && d.children.length) {
          d.children.forEach((nextData) => {
            fn(nextData);
          });
        }
      };
      if (target.children && target.children.length) {
        target.children.forEach((d) => {
          fn(d);
        });
      }
      return target;
    },
    nodeChange(params) {
      let oldNode = this.findNodeByDataJson(params.node.id);
      switch (params.type) {
        case "data":
          for (let key in oldNode.data) {
            oldNode.data[key] = params.node.data[key];
          }
          // data 可以不需要刷新layout
          return;
        case "status":
          for (let key in oldNode.data) {
            oldNode.data[key] = params.node.data[key];
          }
          break;
        case "copy":
          var target = this.findNodeByDataJson(params.targetId);
          target = this.updateId(target);
          if (oldNode.children && oldNode.children.length) {
            oldNode.children.push(target);
          } else {
            oldNode.children = [target];
          }
          break;
        case "markTarget":
          oldNode.markId = params.targetId;
          break;
        case "linkCustom":
          // 链接自定义节点
          var link = this.updateId(params.linkCustom);
          console.log(params.linkCustom);
          if (oldNode.children && oldNode.children.length) {
            oldNode.children.push(link);
          } else {
            oldNode.children = [link];
          }
          break;
      }
      console.log(this.dataJson, 1231);
      this.initLayout();
    },
    editEvent(node) {
      this.$refs.EditDialog.init(node);
    },
    getNodeById(id) {
      return this.graph.getCellById(id);
    },

    createNodeByJson(d) {
      const shape = {
        exnode: "dag-exnode",
        common: "dag-common",
      };
      return {
        id: `${d.id}`,
        shape: shape[d.type],
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
      const color = statusColor[d.data.status];
      return {
        source: { cell: d.id, port: "right-" + d.id },
        target: { cell: nextItem.id, port: "left-" + nextItem.id },
        router: {
          name: "manhattan",
        },
        attrs: {
          line: {
            stroke: color,
            strokeWidth: 4,
          },
        },
      };
    },
    // 初始化节点/边
    initLayout() {
      const formJson = {
        nodes: [],
        edges: [],
      };

      const fn = (d) => {
        formJson.nodes.push(this.createNodeByJson(d));
        if (d.children && d.children.length) {
          d.children.forEach((nextData) => {
            !nextData.id && (nextData.id = generateUniqueId());
            formJson.edges.push(this.createEdgeByJson(d, nextData));
            fn(nextData);
          });
        }
        if (d.markId) {
          formJson.edges.push(this.createEdgeByJson(d, { id: d.markId }));
        }
      };

      this.dataJson.forEach((d) => {
        !d.id && (d.id = generateUniqueId());
        fn(d);
      });

      const dagreLayout = new DagreLayout({
        type: "dagre",
        rankdir: "LR",
        ranksep: 100, // 横间隔
        nodesep: 100, // 竖间隔
      });

      const model = dagreLayout.layout(formJson);

      this.graph.fromJSON(model);
      this.setDargeDemoDataJSON();
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
      localStorage.setItem("x6Json", JSON.stringify(this.dataJson));
    },
    loadFn() {
      // this.timer && clearTimeout(this.timer);
      this.dataJson = JSON.parse(localStorage.getItem("x6Json"));
      this.initLayout();
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
