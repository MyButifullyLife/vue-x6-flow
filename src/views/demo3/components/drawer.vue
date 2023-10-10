<template>
  <div class="Ec-x6-icon">
    <el-drawer
      title="自定义框框"
      :visible.sync="visible"
      :direction="direction"
      size="300px"
      :modal="false"
      :modal-append-to-body="false"
      style="position: absolute; width: 300px; box-sizing: border-box"
      show-close
    >
      <section class="listBar" @click.stop="">
        <p @click="showMore = !showMore">
          <img
            :class="{ arrow: showMore }"
            src="@/assets/svg/arrow.svg"
            alt=""
          />
          系统组件
        </p>
        <div v-if="showMore" class="listBar-cot">
          <div
            v-for="(item, index) in configList"
            :key="index"
            class="drag-cot"
            draggable="true"
            @dragend="dragend(item)"
          >
            <span>
              <img src="@/assets/svg/defaultImg.svg" alt="" />
            </span>
            <p>
              {{ item.data.name }}
            </p>
          </div>
        </div>
      </section>
    </el-drawer>
  </div>
</template>

<script>
const mouseXY = { x: null, y: null };
import config from "./config";
import { generateUniqueId } from "@/utils";
export default {
  name: "DrawerCom",
  data() {
    return {
      visible: true,
      direction: "ltr",
      showMore: true,
      configList: config,
    };
  },
  mounted() {
    document.getElementById("container").addEventListener(
      "dragover",
      function (e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
  },
  methods: {
    getPortStyle(text, textColor, borderColor) {
      return {
        portNameLabel: {
          text,
          fill: textColor,
          refX: 5,
          refY: 5,
        },
        portBody: {
          width: 30,
          height: 20,
          strokeWidth: 1,
          fill: borderColor,
          magnet: true,
        },
      };
    },
    nodeConfig(item, x, y) {
      let config = "";
      const id = generateUniqueId();

      // 链接桩3种状态 1、in | 只允许被连  2、out | 只允许输出  3、any | 不限制
      switch (item.type) {
        case "common":
          config = {
            id,
            x: x,
            y: y,
            width: item.width,
            height: item.height,
            shape: `node-${item.type}`,
            data: item,
            ports: {
              items: [
                {
                  id: `top-${id}`,
                  group: "top",
                },
                {
                  id: `out-${id}`,
                  group: "list", // 指定分组名称
                  attrs: this.getPortStyle("肯定", "blue", "#a4c8eb"),
                },
                {
                  id: `out2-${id}`,
                  group: "list", // 指定分组名称
                  attrs: this.getPortStyle("拒绝", "red", "#f1a6a6"),
                },
              ],
            },
          };
          break;
      }
      return config;
    },
    dragend: function (item) {
      const parentRect = document
        .getElementById("container")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        this.$emit("addNode", this.nodeConfig(item, mouseXY.x, mouseXY.y));
      }
    },
  },
};
</script>
<style lang="less" scoped>
.Ec-x6-icon /deep/ .el-drawer__body {
  overflow-y: scroll;
}

.Ec-x6-icon /deep/ .el-drawer__header {
  padding: 0 12px;
  margin-bottom: 0;
  width: 300px;
}

.listBar {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 14px;
}

.listBar img {
  width: 12px;
}

.arrow {
  transform: rotate(90deg);
  transition-duration: 0.3s;
}

.listBar-cot {
  display: inline-block;
  padding-left: 12px;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
}

.listBar-cot .drag-cot {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
}

.listBar-cot .drag-cot span {
  display: inline-block;
  width: 50px;
  height: 50px;
}

.listBar-cot .drag-cot span img {
  width: 100%;
  height: 100%;
}

.listBar-cot .drag-cot p {
  margin: -2px 0 0;
  text-align: center;
  font-size: 12px;
  color: #939393;
}
</style>
