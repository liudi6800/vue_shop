// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
axios.defaults.withCredentials = true
import qs from  'qs';

Vue.prototype.$ajax=axios;
Vue.prototype.$qs=qs;
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small'
});




//设置axios 的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么，例如加入token

  //获取浏览器中的token
  let token= window.sessionStorage.getItem("token" ); //可能有没有值

  if(token!=null){

    //将请求中加入token参数
    //axios中设置参数    get请求和post请求  get 设置在 config.params  post  config.data
    if (config.method === 'post') { //判断是否为post请求
      config.params = {
        "token":token
      }
    } else if (config.method === 'get') {
      config.params = {
        "token": token
      }
    }
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// http response 拦截器
axios.interceptors.response.use( response => {
   if(response.data.code==600){
     router.push("/login")
   }
    return response;
  },
  error => {
    if (error.response) {
      return Promise.reject(error)
    }
  });


//配置路由守卫

router.beforeEach((to, from, next) => {



  if(to.fullPath=="/login"){
    next();
  }else{
    let token=window.sessionStorage.getItem("token");
    if(token!="" && token!=null){
      next();
    }else{
      //设置跳转路由
      next({path:"/login"});
    }

  }


  //  to  去  from  来自   next 允许通过


})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

