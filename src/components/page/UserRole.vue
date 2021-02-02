<template>
    <div>

      <el-button type="primary" @click="addRole">新增角色</el-button>

      <el-table  :data="roleData"  style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column prop="id"  label="序号" width="180"> </el-table-column>

        <el-table-column  prop="name"  label="角色名称"  width="180"> </el-table-column>

        <el-table-column    align="center"  label="是否启用"  width="180"  >

          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isDel"
              :active-value="0"
              :inactive-value="1"
              active-text="是"
              inactive-text="否"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="change(scope.row)">
            </el-switch>

          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                       @click="handleEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>



      <!--   新增模板-->
      <el-dialog title="新增品牌"  :visible.sync="addHtml"  >
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="180px"  >

          <el-form-item label="角色名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addSubmit('addForm')">立即新增</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--   修改模板-->
      <el-dialog title="新增品牌"  :visible.sync="updateHtml"  >
        <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="180px"  >

          <el-form-item label="角色名称" prop="name">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateSubmit('updateForm')">立即修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserRole",
      data(){
          return{
            rules: {
              name: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
                { min: 1, max: 15, message: '长度在 1到 15 个字符', trigger: 'blur' }
              ],
            },

            roleData:[],
            addHtml:false,
            addForm:{
              name:"",
            },
            updateHtml:false,
            updateForm:{
              id:"",
              name:"",
            },

          }
      },
      created:function () {
          this.queryRoleData();
      },
      methods:{
         queryRoleData(){
           this.$ajax.get("http://localhost:8083/api/role/selectRole").then(res=>{
             this.roleData=res.data.data}).catch(err=>console.log(err));
         },
        change:function (row) {
          debugger;
          this.$ajax.delete("http://localhost:8083/api/role/delRole",{
            params:{
              id:row.id,isDel:row.isDel
            }
          }).then(res=> this.queryRoleData()).catch(err=>console.log(err));

        },
        addRole:function () {
            this.addHtml=true;
        },
        addSubmit:function (addForm) {
          this.$refs[addForm].validate((valid) => {
            if (valid) {
              this.$ajax.post("http://localhost:8083/api/role/addRole",this.$qs.stringify(this.addForm)).then((res)=>{
                  this.addHtml=false;
                this.queryRoleData();
                }
              ).catch(err=>console.log(err))
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        handleEdit:function (row) {
          this.updateHtml=true;
          this.updateForm=JSON.parse(JSON.stringify(row));
        },
        updateSubmit:function (updateForm) {
          this.$refs[updateForm].validate((valid) => {
            if (valid) {
              this.$ajax.post("http://localhost:8083/api/role/updateRole",this.$qs.stringify(this.updateForm)).then((res)=>{
                  this.updateHtml=false;
                  this.queryRoleData();
                }
              ).catch(err=>console.log(err))
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }




      }
    }
</script>

<style scoped>

</style>
