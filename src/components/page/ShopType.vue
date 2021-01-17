<template >
  <div>
    <h1>商品类型</h1>

    <el-tree :data="data"
             show-checkbox
             :props="defaultProps"
             @node-click="handleNodeClick"
             node-key="id"
             default-expand-all
             :expand-on-click-node="false"
             >

        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="() => update(data)">
            修改
          </el-button>
        </span>
      </span>
    </el-tree>


    <el-dialog title="新增节点" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="addForm" label-width="180px" >
        <el-form-item label="父节点ID">
          <el-input v-model="addForm.pid" disabled></el-input>
        </el-form-item>

        <el-form-item label="父节点名称">
          <el-input v-model="addForm.pidName" ></el-input>
        </el-form-item>

        <el-form-item label="子节点名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog title="修改节点" :visible.sync="updateHtml">
      <el-form ref="form" :model="updateFrom" label-width="180px" >
        <el-form-item label="节点ID">
          <el-input v-model="updateFrom.id" disabled></el-input>
        </el-form-item>

        <el-form-item label="节点名称">
          <el-input v-model="updateFrom.name" ></el-input>
        </el-form-item>

        <el-form-item label="是否删除">
          <el-radio v-model="updateFrom.isDel" label="1" border  v-bind:disabled="isTorF" >是</el-radio>
          <el-radio v-model="updateFrom.isDel" label="0" border>否</el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateSubmit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>

</template>

<script>

    export default {
        name: "ShopType",
      data(){
          return{
            data:[],
            ajaxData:[],
            jsonStr:"",
            defaultProps: {},
            dialogTableVisible:false,
            updateHtml:false,
            addForm:{},
            updateFrom:{
              name:"",
              isDel:"0"
            },
            isTorF:false

          }
      },
      created:function () {

      this.$ajax.get("http://localhost:8083/api/type/getData").then(res=>{
        this.ajaxData=res.data.data;
        this.queryParent();

      }).catch((res)=>{console.log(res)})
      },
      methods:{
        handleNodeClick(data) {

        },
        queryParent:function () {

          for (let i = 0; i <this.ajaxData.length ; i++) {
            if(this.ajaxData[i].pid==0){
              this.diguiData(this.ajaxData[i]);
              break;
            }
          }
          this.data.push(JSON.parse(this.jsonStr));
        },
        diguiData:function(node){

         var tf= this.isParent(node);
          //{"id":1,"label":"分类",}
          //{"id":1,"label":"分类","children":[]}
          if(tf==true){
            this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
            var count=0;
            for (let i = 0; i <this.ajaxData.length ; i++) {

              if(node.id==this.ajaxData[i].pid){
                count++;
                this.diguiData(this.ajaxData[i]);
                this.jsonStr+=",";
              }
            }
            if(count!=0){
              this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
            }

            this.jsonStr+=']}';

          }else{
          this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';
          }
        },
        isParent:function (node) {
          for (let i = 0; i <this.ajaxData.length ; i++) {
            if(node.id==this.ajaxData[i].pid){
                  return true;
            }
          }
          return false;
        },
        append:function (data) {

          this.dialogTableVisible=true;
          this.addForm.pid=data.id;
          this.addForm.pidName=data.label;
        },
        update:function (data) {

          this.updateHtml=true;
          this.updateFrom.id =data.id;

          this.updateFrom.name =data.label;
          var a =this.isParent(data);
            if(a==true){
              this.isTorF=true;
              this.updateFrom.isDel="0";
            }else{
              this.isTorF=false;
              this.updateFrom.isDel="0";
            }

        },
        onSubmit:function () {
          this.$ajax.post(" http://localhost:8083/api/type/add",this.$qs.stringify(this.addForm)).then((res)=>location.reload()).catch(err=>console.log(err))
        },
        updateSubmit:function () {
          this.$ajax.post(" http://localhost:8083/api/type/update",this.$qs.stringify(this.updateFrom)).then((res)=>location.reload()).catch(err=>console.log(err))

        }
      }
    }
</script>

<style scoped>

</style>
