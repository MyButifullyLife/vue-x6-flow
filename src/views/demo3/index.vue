<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container" @click.stop="hideFn">
        <MenuBar
          v-if="showContextMenu"
          ref="menuBar"
          @callBack="contextMenuFn"
        />
        <header>
          <el-tooltip
            class="item"
            effect="dark"
            content="项目"
            placement="bottom"
          >
            <i class="el-icon-menu" @click="showDrawerFn()" />
          </el-tooltip>
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
            content="执行"
            placement="bottom"
          >
            <i class="el-icon-video-play" @click="startFn()" />
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
        </header>
        <div id="draw-cot" />
        <Drawer ref="drawer" @addNode="addNode" />
      </div>
    </section>
    <DialogCondition ref="dialogCondition"></DialogCondition>
    <DialogMysql ref="dialogMysql"></DialogMysql>
  </div>
</template>

<script>
import MenuBar from "./components/menuBar";
import Drawer from "./components/drawer";
import DialogCondition from "./components/dialog/condition.vue";
import DialogMysql from "./components/dialog/mysql.vue";

import graphMixin from "./graphMixin.js";

export default {
  name: "App",
  components: { MenuBar, Drawer, DialogCondition, DialogMysql },
  mixins: [graphMixin],
  data() {
    return {
      graph: "",
      timer: "",
      isLock: false,
      showContextMenu: false,
    };
  },
  mounted() {
    this.graph = this.initGraph();
    this.keyBindFn();
  },
  methods: {
    getNodeById(id) {
      return this.graph.getCellById(id);
    },
    hideFn() {
      this.showContextMenu = false;
    },
    async showNodeStatus(statusList) {
      const status = statusList.shift();
      status?.forEach((item) => {
        const { id, status } = item;
        const node = this.graph.getCellById(id);
        const data = node.getData();
        node.setData({
          ...data,
          status: status,
        });
      });
      this.timer = setTimeout(() => {
        this.showNodeStatus(statusList);
      }, 300);
    },
    // 初始化节点/边
    init(data = []) {
      const cells = [];
      data.forEach((item) => {
        if (item.shape === "dag-edge") {
          cells.push(this.graph.createEdge(item));
        } else {
          delete item.component;
          cells.push(this.graph.createNode(item));
        }
      });
      this.graph.resetCells(cells);
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
    keyBindFn() {
      // copy cut paste
      this.graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.copy(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.cut(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 });
          this.graph.cleanSelection();
          this.graph.select(cells);
        }
        return false;
      });

      // undo redo
      this.graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo();
        }
        return false;
      });
      // delete
      this.graph.bindKey(["delete"], () => {
        const select = this.graph.getSelectedCells();
        select?.forEach((item) => {
          if (/edge/.test(item.shape)) {
            this.graph.removeEdge(item.id);
          } else {
            this.graph.removeNode(item.id);
          }
        });
        return false;
      });
    },
    saveFn() {
      localStorage.setItem(
        "x6Json",
        JSON.stringify(this.graph.toJSON({ diff: true }))
      );
    },
    loadFn() {
      this.timer && clearTimeout(this.timer);
      const x6Json = JSON.parse(localStorage.getItem("x6Json"));

      this.startFn(x6Json.cells);
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
    contextMenuFn(type, node) {
      switch (type) {
        case "remove":
          if (node.type == "edge") {
            this.graph.removeEdge(node.item.id);
          } else if (node.type == "node") {
            this.graph.removeNode(node.item.id);
          }
          break;
        case "source":
          this.$refs.dialogMysql.visible = true;
          this.$refs.dialogMysql.init(node);
          break;
      }

      this.showContextMenu = false;
    },

    showDrawerFn() {
      this.$refs.drawer.visible = !this.$refs.drawer.visible;
    },
    addNode(option) {
      const p = this.graph.pageToLocal(option.x, option.y);
      this.graph.addNode(Object.assign({}, option, p));
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
