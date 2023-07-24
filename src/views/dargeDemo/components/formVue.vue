<template>
  <div class="FormVue" :style="styleItem">
    <div>内容信息展示</div>
    <div class="text">
      <el-input size="mini" v-model="textInput"></el-input>
    </div>
    <el-button size="mini" @click="change">修改</el-button>
  </div>
</template>

<script>
export default {
  name: "FormVue",
  props: {
    text: {
      type: String,
      default: "",
    },
    styleItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    text: {
      handler() {
        this.textInput = this.text;
      },
      immediate: true,
    },
  },
  data() {
    return {
      textInput: "",
    };
  },
  methods: {
    change() {
      this.$emit("change", this.textInput);
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.FormVue {
  border: 1px dashed #a2a2a2;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
}
.text {
  padding: 10px;
}
</style>
