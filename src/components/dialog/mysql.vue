<template>
  <el-dialog :title="itemDetail.item ? itemDetail.item.data.label :''" :visible.sync="visible" width="600px">
      <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="名字">
              <el-input v-model="label" placeholder="修改名字"></el-input>
          </el-form-item>
      </el-form>
    <footer class="footer">
      <el-button  type="primary"  @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>

  export default {
    name: 'dialogMysql',

    data() {
      return {
        visible: false,
        bool:true,
        itemDetail:{},
        label:''
      }
    },
    mounted() {

    },
    methods:{
      init(item){
         this.itemDetail = item
          this.label = item.item.data.label
      },
      submit(){
        this.itemDetail.item.data.label = this.label;
        this.visible = false

      }
    }
  }
</script>
<style  scoped>
  section{
    display: flex;
    align-items: center;
    justify-content: center;
  }
.footer{
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
