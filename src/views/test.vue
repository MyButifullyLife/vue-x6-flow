<template>
  <div style="padding-top: 100px">
    <el-button type="primary" @click="goDemo(0)"> demo1</el-button>
    <el-button type="primary" @click="goDemo(1)"> demo2</el-button>
  </div>
</template>

<script>
export default {
  name: "TestCom",
  methods: {
    goDemo(num) {
      const router = ["/dragDemo", "/dargeDemo"];
      this.$router.push(router[num]);
    },
  },
};
</script>
