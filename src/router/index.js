import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/hello'
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
          path: '/shopType',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ShopType.vue'),
          meta: { title: '商品类型' }
        },
        {
          path: '/shopBrand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/ShopBrand.vue'),
          meta: { title: '商品品牌' }
        },
      ]
    }

  ]
});
