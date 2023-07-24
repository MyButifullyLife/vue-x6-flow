<template>
  <el-drawer
    title="API 实例"
    :visible.sync="visible"
    width="700px"
    :modal="false"
  >
    <el-form ref="form" label-width="140px" size="small">
      <template v-if="nodeItem">
        <el-form-item label="当前编辑节点">
          {{ nodeItem.data.label }}
        </el-form-item>
        <el-form-item label="当前编辑节点Id">
          {{ nodeItem.id }}
        </el-form-item>
      </template>

      <el-form-item label="修改状态">
        <div class="fx-left">
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button @click="changeStatus('status')" type="primary"
            >确定</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="复制节点">
        <div class="fx-left">
          <el-select v-model="copyTarget" placeholder="请选择">
            <el-option
              v-for="(item, index) in copyList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button @click="changeStatus('copy')" type="primary"
            >确定</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="连线到某个节点">
        <div class="fx-left">
          <el-select v-model="markId" placeholder="请选择">
            <el-option
              v-for="(item, index) in copyList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-form-item>
            <el-input v-model="markId" palceholder="输入目标id"></el-input>
          </el-form-item>

          <el-button @click="changeStatus('markTarget')" type="primary"
            >确定</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="接入自定义结构">
        <div class="fx-left">
          <el-select v-model="customIndex" placeholder="请选择">
            <el-option
              v-for="(item, index) in customOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button @click="changeStatus('linkCustom')" type="primary"
            >确定</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { customJson } from "../config";
export default {
  name: "EditDialog",
  data() {
    return {
      visible: false,
      nodeItem: "",
      copyList: [],
      copyTarget: "",
      markId: "",
      status: "",
      options: [
        {
          value: "success",
          label: "成功",
        },
        {
          value: "error",
          label: "失败",
        },
        {
          value: "normal",
          label: "正常",
        },
      ],
      customOptions: [],
      customIndex: "",
    };
  },
  beforeDestroy() {},
  mounted() {
    customJson.forEach((e, index) => {
      this.customOptions.push({
        label: "自定义结构" + (index + 1),
        value: "自定义结构" + (index + 1),
        link: e,
      });
    });
  },
  methods: {
    getCopyList() {
      this.copyList = [];
      const fn = (d) => {
        this.copyList.push({
          value: d.id,
          label: d.data.label,
        });
        if (d.children && d.children.length) {
          d.children.forEach((nextData) => {
            fn(nextData);
          });
        }
      };

      if (window.$DargeDemoDataJSON) {
        window.$DargeDemoDataJSON.forEach((d) => {
          fn(d);
        });
      }
    },
    changeStatus(type) {
      const node = JSON.parse(JSON.stringify(this.nodeItem));
      node.data.status = this.status;
      const params = {
        type,
        node: node,
      };

      switch (type) {
        case "copy":
          params.targetId = this.copyTarget;
          break;
        case "status":
          break;
        case "markTarget":
          params.targetId = this.markId;
          break;
        case "linkCustom":
          params.linkCustom = this.customOptions.find(
            (e) => e.value === this.customIndex
          ).link;
          console.log(params, 123123);
          break;
      }
      this.$emit("change", params);
    },
    init(node) {
      this.nodeItem = node;
      this.status = node.data.status;
      this.visible = true;
      this.getCopyList();
    },
  },
};
</script>

<style lang="less" scoped>
.fx-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
