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
            <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                       @click="addRoleMenu(scope.row)">赋权限</el-button>
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





       <!--   角色赋权限模板-->
      <el-dialog title="角色赋权限"  :visible.sync="addRoleMenuHtml"  >
        <el-form ref="fuquanForm" :rules="rules" :model="fuquanForm" label-width="180px"  >

        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          node-key="id"
          show-checkbox
          ref="trees"
          @check="clickTree"
          :default-checked-keys="checkedId"
          :expand-on-click-node="false">
        </el-tree>
          <el-form-item>
            <el-button type="primary" @click="fuquanFormSubmit">赋权限</el-button>
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



            addRoleMenuHtml:false,
            data: [],
            menuData: [],
            menuDataStr: '',
            defaultProps: {},
            fuquanForm:{
              rid:"",
              menus:""
            },
            checkedId:[]

          }
      },
      created:function () {
          this.queryRoleData();
        this.queryMenuData();
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
        },
        addRoleMenu:function (row) {
          this.$nextTick(() => {
            this.$refs.trees.setCheckedKeys([])
          });

          this.addRoleMenuHtml=true;
          this.fuquanForm.rid=row.id;

          debugger;
          this.$ajax.get("http://localhost:8083/api/menu/selectRoleMenuDataByRid?rid="+row.id).then(res => {
          let aa=res.data.data;
              let arr=[];
              for (let i = 0; i <aa.length ; i++) {
                arr.push(aa[i].mid);
              }
              arr.forEach(i => {
                var node = this.$refs.trees.getNode(i);//根据id 拿到 Tree 组件中的node的所有信息
                if (node.isLeaf) {//node.isLeaf：判断当前节点是否为子节点
                  this.$refs.trees.setChecked(node, true);//如果是子节点，就把状态设置成选中
                }else{

                }
              })

          }).catch(re => {
            console.log(re);
          })


        },
        //查询所有的权限数据
        queryMenuData: function () {
          this.$ajax.get("http://localhost:8083/api/menu/selectMenuData").then(res => {
            this.menuData = res.data.data;
            this.queryTop();
          }).catch(re => {
            console.log(re);
          })
        },
        //查询顶层的权限数据
        queryTop: function () {
          for (let i = 0; i < this.menuData.length; i++) {
            if (this.menuData[i].pid == 0) {
              this.queryMenuDataStr(this.menuData[i]);
              break;
            }
          }
          this.data.push(JSON.parse(this.menuDataStr));
        },
        //拼接树结构数据
        queryMenuDataStr: function (data) {
          if (data.type == 0) {
            this.menuDataStr += '{"id":' + data.id + ',"label":"' + data.name + '","children":[';
            let count = 0;
            for (let i = 0; i < this.menuData.length; i++) {
              if (this.menuData[i].pid == data.id) {
                count++;
                this.queryMenuDataStr(this.menuData[i]);
                this.menuDataStr += ",";
              }
            }
            if (count != 0) {
              this.menuDataStr = this.menuDataStr.substr(0, this.menuDataStr.length - 1);
            }
            this.menuDataStr += ']}';
          } else {
            this.menuDataStr += '{"id":' + data.id + ',"label":"' + data.name + '"}';
          }
        },
        clickTree:function () {
          let allMenuId = [].concat(this.$refs.trees.getCheckedKeys(), this.$refs.trees.getHalfCheckedKeys());
          //console.log(allMenuId);
          this.fuquanForm.menus="";
          for (let i = 0; i <allMenuId.length ; i++) {
            this.fuquanForm.menus+=allMenuId[i]+",";
          }
          console.log(this.fuquanForm.menus);
        },
        fuquanFormSubmit:function () {
           debugger;
           if(this.fuquanForm.menus!="" && this.fuquanForm.menus!=null){
             this.$ajax.post("http://localhost:8083/api/menu/addRoleMenu",this.$qs.stringify(this.fuquanForm)).then(res=>console.log(res)).catch(err=>console.log(err));
             this.addRoleMenuHtml=false;
           }else{
             this.$message.error("请至少选择一个权限");
           }
        }

      }
    }
</script>

<style scoped>

</style>
