<template>
  <div class="content">
    <div class="node" :class="status">
      <span class="label">{{ label }}</span>
    </div>
  </div>
</template>

<script>
import { statusColor } from "@/views/dargeDemo/config";
export default {
  name: "CommonNode",

  inject: ["getGraph", "getNode"],
  data() {
    return {
      status: "",
      label: "",
      node: "",
      statusColor,
    };
  },
  methods: {
    editFn() {
      console.log(this.node);
      this.$EventBus.$emit("DargeEditEvent", this.node);
    },
  },
  mounted() {
    this.editFn.bind(this);
    const node = this.getNode();
    this.node = node;
    this.label = node.data.label || "";
    this.status = node.data.status || "";
  },
};
</script>
<style lang="less" scoped>
@import "../../../../style/dargeLess.less";
.content {
  padding-right: 10px;
  width: 100%;
  height: 100%;
}
.node {
  display: flex;
  width: calc(100% - 24px);
  height: 100%;
  align-items: center;
  position: relative;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  padding-right: 10px;
  > .right {
    position: absolute;
    z-index: 1000;
    right: -10px;
    .icon {
      font-size: 20px;
      background-color: #ffffff;
      cursor: pointer;
    }
  }
}

.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}
</style>
