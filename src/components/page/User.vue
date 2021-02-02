<template>
  <div>
    <h1>用户列表</h1>
    <el-form :inline="true" ref="eachFrom" :model="eachFrom" class="demo-form-inline">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="eachFrom.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="eachFromSubmit">查询</el-button>
        <el-button type="primary" @click="eachFromRes('eachFrom')">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table  :data="userData"  style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="id"  label="序号" width="80"> </el-table-column>

      <el-table-column  prop="name"  label="用户账号"  width="80"> </el-table-column>
      <el-table-column  prop="realName"  label="真实姓名"   width="80"> </el-table-column>
      <el-table-column  prop="sex"  label="用户性别" :formatter="forSex"  width="80"> </el-table-column>
      <el-table-column  prop="phone"  label="用户手机号"  width="110"> </el-table-column>
      <el-table-column  prop="email"  label="用户邮箱"  width="140"> </el-table-column>
      <el-table-column  prop="idCard"  label="用户身份证"  width="180"> </el-table-column>
      <el-table-column  prop="birthday"  label="用户生日"  width="100"> </el-table-column>
      <el-table-column  prop="imgpath" label="用户头像"  width="180">
        <template slot-scope="scope">
          <img   style="width: 100px; height: 100px"  :src="scope.row.imgUrl"  />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"  circle size="mini" type="danger"
                     @click="handleEdit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[2, 3, 5, 7]"
      :page-size="100"
      layout="total,sizes, prev, pager, next, jumper "
      :total="count">
    </el-pagination>





    <!--   修改品牌模板-------------------->
    <el-dialog title="修改品牌"  :visible.sync="updateHtml">
      <el-form :model="updateForm"  ref="updateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="真实名称" prop="realName">
          <el-input v-model="updateForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="请选择性别" prop="sex">
          <el-radio v-model="updateForm.sex" :label="1" border>男</el-radio>
          <el-radio v-model="updateForm.sex" :label="2" border>女</el-radio>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="updateForm.phone" ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="updateForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="用户身份证" prop="idCard">
          <el-input v-model="updateForm.idCard" ></el-input>
        </el-form-item>
        <el-form-item label="用户出生日期" prop="birthday">
          <el-date-picker
            v-model="updateForm.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户头像" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8083/api/brand/uploadImgPath"
            :show-file-list="false"
            :on-success="updateuploadSucces">
            <img v-if="imagPath" :src="imagPath"  class="avatar" v-model="updateForm.imgUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户学历" prop="eduId">
          <el-select v-model="updateForm.eduId" placeholder="请选择">
            <el-option
              v-for="item in eduIds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户部门" prop="deptId">
          <el-select v-model="updateForm.deptId" placeholder="请选择">
            <el-option
              v-for="item in depts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>

          <el-button @click="updateUser('updateForm')">修改</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
    export default {
        name: "User",
      data(){
          return{
            eachFrom:{
              name:"",
              page:"1",
              limit:"2",
            },
            userData:[],
            count:0,
            updateHtml:false,
            imagPath:"",
            updateForm:{
              id:"",
              realName:"",
              sex:"",
              phone:"",
              email:"",
              idCard:"",
              birthday:"",
              imgUrl:"",
              eduId:"",
              deptId:""
            },




            eduIds: [{
              value: '0',
              label: '小学'
            }, {
              value: '1',
              label: '初中'
            }, {
              value: '2',
              label: '高中'
            }, {
              value: '3',
              label: '大学'
            }],
            depts: [{
              value: '0',
              label: '保洁部门'
            }, {
              value: '1',
              label: '安保部门'
            }, {
              value: '2',
              label: '人事部门'
            }, {
              value: '3',
              label: '高管部门'
            }, {
              value: '4',
              label: '董事会'
            }],

          }
      },
      created:function () {
        this.queryUserData();
      },
      methods:{
        handleSizeChange:function (val) {
          this.eachFrom.limit=val;
          this.queryUserData();
        },
        handleCurrentChange:function (val) {
          this.eachFrom.page=val;
          this.queryUserData();
        },
        queryUserData:function () {
          this.$ajax.get("http://localhost:8083/api/user/getData?"+this.$qs.stringify(this.eachFrom)).then(res=>{
            this.userData=res.data.data.data;
            this.count=res.data.data.count;
          }).catch(err=>console.log(err))
        },
        eachFromSubmit:function(){
          this.queryUserData();
        },
        handleEdit:function (row) {
          this.updateHtml=true;
          this.imagPath="";
          this.updateForm=JSON.parse(JSON.stringify(row));
          this.imagPath=JSON.parse(JSON.stringify(row)).imgUrl;
          this.updateForm.imgpaths=JSON.parse(JSON.stringify(row)).imgUrl;
        },
        updateuploadSucces:function (a) {
          this.addForm.imgUrl=a.data;
          this.imagPath=a.data;
        },
        updateUser:function () {
          this.$ajax.post("http://localhost:8083/api/user/updateUser",this.$qs.stringify(this.updateForm)).then(res=>{
            console.log(res);
            this.updateHtml=false;
            this.queryUserData();
          })
        },
        eachFromRes:function(eachFrom){
          this.$refs[eachFrom].resetFields();
        },
        forSex:function (a,b,c,d) {
          return c==1?"男":"女";
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
