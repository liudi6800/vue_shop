import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [

        {
          path: '/hello',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/HelloWord.vue'),
          meta: { title: '欢迎页面' }
        },
        {
          path: '/shop',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Shop.vue'),
          meta: { title: '商品列表' }
        },
        {
          path: '/addShop',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/AddShop.vue'),
          meta: { title: '新增商品' }
        },
        {
          path: '/shopType',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ShopType.vue'),
          meta: { title: '商品类型' }
        },
        {
          path: '/shopBrand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ShopBrand.vue'),
          meta: { title: '商品品牌' }
        },
        {
          path: '/shopProperty',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ShopProperty.vue'),
          meta: { title: '商品属性' }
        },
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    }, {
      path: '/addUser',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/AddUser.vue'),
      meta: { title: '注册' }
    },

  ]
});
