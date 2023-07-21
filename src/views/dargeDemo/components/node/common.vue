<template>
  <div class="node">
    <span class="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "CommonNode",

  inject: ["getGraph", "getNode"],
  data() {
    return {
      status: "",
      label: "",
    };
  },
  mounted() {
    const self = this;
    const node = this.getNode();
    this.label = node.data.label;

    // 监听数据改变事件
    node.on("change:data", ({ current }) => {
      self.label = current.label;
    });
  },
};
</script>
<style lang="less" scoped>
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
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
