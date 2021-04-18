<template>
  <div class="sidebar">
    <!-- 
            default-active: 默认点击的菜单是哪个 -- 激活状态
            collapse：是否收缩起来 -- 默认不收缩
            router: 导向 点击后会指向哪个页面 -- 跳转页面
         -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#334256"
      text-color="#ffffff"
      active-text-color="#20a0ff"
      router
    >
      <template v-for="item in items">
        <template>
          <el-menu-item :index="item.index" :key="item.index">
            <!--图标-->
            <i :class="item.icon"></i>
            {{item.title}}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../assets/js/bus"
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-document",
          index: "Info", // 指向 info 页面
          title: "系统首页"
        },
        {
          icon: "el-icon-document",
          index: "Consumer",
          title: "用户管理"
        },
        {
          icon: "el-icon-document",
          index: "Singer",
          title: "歌手管理"
        },
        {
          icon: "el-icon-document",
          index: "SongList",
          title: "歌单管理"
        },
      ]
    }
  },
  // 监控变化
  computed: {
    onRoutes() {
        // 具体和 router 下的 index 的path有关 
        return this.$route.path.replace("/", '');
    },
  },
  created(){
    // 通过bus进行组件间的通信来折叠侧边栏  --> 根据接收 TheHeader 中传过来的信息
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0px;
  top: 70px;
  bottom: 0px;
  background-color: #334256;
  overflow-y: scroll; /* 超出范围上下滚动*/
}

/* 缩略起来起来时去掉上下箭头 */
.sidebar::-webkit-scrollbar{
  width: 0px;
}
/* 只有 collapse = false才气作用 */
.sidebar-el-menu:not(.el-menu--collapse){
  width: 150px;
}

/* 解决细节问题 鼠标放到边边时有黑色的点 */
.sidebar > ul {
  height: 100%;
}
</style>>