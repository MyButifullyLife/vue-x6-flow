<template>
  <div class="content">
    <div class="node" :class="status">
      <span class="label">{{ label }}</span>
      <el-dropdown class="right">
        <span class="el-dropdown-link">
          <i class="el-icon-circle-plus icon"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editFn()"
            >打开编辑器</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <FromVue
        v-if="node.data && node.data.form"
        :styleItem="{ top: '50px' }"
        :text="node.data.form.text1"
        @change="change1"
      ></FromVue>
      <FromVue
        v-if="node.data && node.data.form"
        :styleItem="{ top: '-110px' }"
        :text="node.data.form.text2"
        @change="change2"
      ></FromVue>
    </div>
  </div>
</template>

<script>
import { statusColor } from "@/views/dargeDemo/config";
import FromVue from "../formVue";
export default {
  name: "CommonNode",

  inject: ["getGraph", "getNode"],
  components: { FromVue },
  data() {
    return {
      status: "",
      label: "",
      node: "",
      statusColor,
    };
  },
  methods: {
    change1(text) {
      this.node.data.form.text1 = text;
      this.$EventBus.$emit("DargeEditChange", {
        type: "data",
        node: this.node,
      });
    },
    change2(text) {
      this.node.data.form.text2 = text;
      this.$EventBus.$emit("DargeEditChange", {
        type: "data",
        node: this.node,
      });
    },
    editFn() {
      this.$EventBus.$emit("DargeEditEvent", this.node);
    },
  },
  mounted() {
    // 重要，不然方法可能丢失this
    const methods = this.$options.methods;
    for (let key in methods) {
      methods[key].bind(this);
    }
    // this.editFn.bind(this);
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
