<template>
    <div class="content " >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户账号" prop="name"  >
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="真实名称" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="请选择性别" prop="sex">
          <el-radio v-model="addForm.sex" label="1" border>男</el-radio>
          <el-radio v-model="addForm.sex" label="2" border>女</el-radio>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="addForm.phone" ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="用户身份证" prop="idCard">
          <el-input v-model="addForm.idCard" ></el-input>
        </el-form-item>
        <el-form-item label="用户出生日期" prop="birthday">
          <el-date-picker
            v-model="addForm.birthday"
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
            <img v-if="imagPath" :src="imagPath"  class="avatar" v-model="addForm.imgUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户学历" prop="eduId">
          <el-select v-model="addForm.eduId" placeholder="请选择">
            <el-option
              v-for="item in eduIds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户部门" prop="deptId">
          <el-select v-model="addForm.deptId" placeholder="请选择">
            <el-option
              v-for="item in depts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>

          <el-button @click="addsb('addForm')">注册</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>




    </div>
</template>

<script>
    export default {
        name: "AddUser",
      data() {
        return {
          addForm: {
            name: '',
            realName: '',
            password: '',
            sex: '',
            phone: '',
            email: '',
            idCard: '',
            birthday: '',
            imgUrl: '',
            eduId: '',
            deptId: '',
          },
          rules: {
            name: [
              { required: true, message: '请输入用户账号', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            realName: [
              { required: true, message: '请输入真实名称', trigger: 'blur' },
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
            ],

          },
          imagPath:"",

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


        };
    },
      methods:{
        updateuploadSucces:function (a) {
          this.addForm.imgUrl=a.data;
          this.imagPath=a.data;
        },resetForm:function (addForm) {
          this.$refs[addForm].resetFields();
        },
        addsb:function (addForm) {
          this.$refs[addForm].validate(valid => {
            if (valid) {
               this.$ajax.post("http://localhost:8083/api/userLogin/addUser",this.$qs.stringify(this.addForm)).then(res=>{
                 console.log(res);
                 debugger;
                 if(res.data.data.code==1){
                   this.$message.success('注册成功');
                   this.$router.push('/login');
                 }if(res.data.data.code==2){
                   this.$message.error('用户以存在');
                 }
               }).catch(err=>console.log(err))
            } else {
              console.log('error submit!!');
              return false;
            }
          });


        }

      },

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
