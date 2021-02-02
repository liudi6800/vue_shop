<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="name">
          <el-input v-model="param.name" placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input  type="password" placeholder="请输入密码" v-model="param.password">
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <div class="login-btn">
          <el-button type="primary" @click="addUser">注册</el-button>
        </div>
        <p class="login-tips">Tips : 如有疑问自行解决。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        param: {
          name: "",
          password: "",
        },
        rules: {
          name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    methods: {
      submitForm() {
        this.$refs.login.validate(valid => {
          if (valid) {
           this.$ajax.post("http://localhost:8083/api/userLogin/toLoginUser",this.$qs.stringify(this.param)).then(res=>{
             if(res.data.data.code==3){
               this.$message.success('登录成功');
               this.$router.push('/hello');
             }if(res.data.data.code==2){
               this.$message.error('密码不正确');

             }if(res.data.data.code==1){
               this.$message.error('用户不存在');
             }
           }).catch(err=>console.log(err));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addUser:function () {
        this.$router.push('/addUser');
      }
    },
  };
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }
  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  .ms-content {
    padding: 30px 30px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }
  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }
</style>
