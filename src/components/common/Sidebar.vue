<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
              >{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus';
  export default {
    data() {
      return {
        collapse: false,
        items: [],
        userMenuData:[],
        dataStr:"",
        openeds:[444]
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
        bus.$emit('collapse-content', msg);
      });
      let name = localStorage.getItem('ms_username');
      this.queryUserMenu(name);
    },
    methods:{
      queryUserMenu:function (name) {

        // alert(name);
        this.$ajax.get("http://localhost:8083/api/userLogin/selectUserMeunData?name="+name).then(res=>{

          this.userMenuData=res.data.data;
          this.initTop();
        }).catch(re=>{
          console.log(re);
        })
      },
      initTop:function () {
        for (let i = 0; i <this.userMenuData.length ; i++) {

          if(this.userMenuData[i].pid==0){
            this.dataStr='';
            this.initItems(this.userMenuData[i]);

            this.items.push(JSON.parse(this.dataStr))

          }
        }
      },
      initItems:function (data) {

        if(data.type==0){
          this.dataStr+='{"index":"'+data.url+'","title":"'+data.name+'","subs": [';
          let count=0;
          for (let i = 0; i <this.userMenuData.length ; i++) {
            if(this.userMenuData[i].pid==data.id){
              count++;
              this.initItems(this.userMenuData[i]);
              this.dataStr+=',';
            }
          }
          if(count!=0){
            this.dataStr=this.dataStr.substr(0,this.dataStr.length-1);
          }
          this.dataStr += ']}';
        }else {
          this.dataStr+='{"index":"'+data.url+'","title":"'+data.name+'"}';
        }
      }

    }
  };
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }
  .sidebar > ul {
    height: 100%;
  }
</style>
