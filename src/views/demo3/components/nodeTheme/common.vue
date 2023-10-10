<template>
  <div class="node">
    <h3>{{ label }}</h3>
  </div>
</template>

<script>
export default {
  name: "DatabaseCom",

  inject: ["getGraph", "getNode"],
  data() {
    return {
      status: "logo",

      label: "",
    };
  },
  mounted() {
    // const self = this;
    const node = this.getNode();
    this.label = node.data.data.name;

    // 监听数据改变事件
    // node.on("change:data", ({ current }) => {
    //   self.status = current.status;
    // });
  },
};
</script>
<style lang="less" scoped>
.node {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
</style>
