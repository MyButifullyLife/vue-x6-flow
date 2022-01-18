<template>
  <div>
     <span>abc</span>
  </div>
</template>

<script>
  export default {
    name: "TextDemo",
    inject: ["getGraph", "getNode"],
    data() {
      return {
        num: 0,
      };
    },
    mounted() {
      const self = this;
      const node = this.getNode();
      // 监听数据改变事件
      node.on("change:data", ({ current }) => {
        self.num = current.num;
      });
    },
    methods: {
      add() {
        const node = this.getNode();
        const { num } = node.getData();
        node.setData({
          num: num + 1,
        });
      },
    },
  };
</script>
