<template>
    <div class="header">
        <!-- 折叠图片 -->
        <div class="collapse-btn" @click="collapseChange">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">music 后台管理</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                <i class="el-icon-rank"></i>
                </el-tooltip>
            </div>
            <div class="user-avator">
                <img src="../assets/img/user.jpg" alt="头像">
            </div>
            <!-- 下拉菜单 退出功能 -->
            <el-dropdown class="user-name" trigger="click" @command="hanldeCommand">
                <span class="el-dropdown-link">
                    {{userName}}
                    <i class="el-icon-caret-bottom"></i>    
                </span>      
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu> 
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import bus from "../assets/js/bus"
export default {
    data(){
        return{
            collapse: false,
            fullscreen: false
        }
    },
    // 状态发生变化后, 取出数据
    computed:{
        userName(){
            return localStorage.getItem('userName');
        }
    },
    methods:{
        // 侧边栏折叠
        collapseChange(){
            this.collapse = !this.collapse;
            // 提交保存最新的状态
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen(){
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.webkitCanceFullscreen){
                    // safari chrome 浏览器
                    document.webkitCanceFullscreen();
                } else if(document.mozCancelFullscreen){
                    // firefox 浏览器
                    document.mozCancelFullscreen();
                } else if (document.msCancelFullscreen) {
                    // ie 
                    document.msCancelFullscreen();
                }
            }else{
                let element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                }else if (element.webkitRequestFullscreen) {
                    // safari chrome 浏览器
                    element.webkitRequestFullscreen();
                } else if (element.mozRequestFullscreen) {
                    // firefox 浏览器
                    element.mozRequestFullscreen();
                }else if (element.msRequestFullscreen) {
                    // ie
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        hanldeCommand(command){
            if (command == "logout") {
                // 清除缓存 回到登录页面
                localStorage.removeItem('userName');
                this.$router.push("/");
            }
        }
    }
}
</script>

<style scoped>
.header{
    position: relative;
    background-color: #253041;
    box-sizing: border-box; 
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #ffffff;
}

.collapse-btn{
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}

.header .logo{
    float: left;
    line-height: 70px;
}

.header-right{
    float: right;
    padding-right: 50px;
    display: flex;
    height: 70px;
    align-items: center;
}

.btn-fullscreen{
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.user-avator{
    margin-left: 20px;
}

.user-avator img{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.user-name {
    margin-left: 10px;
}

.el-dropdown-link{
    color: #ffffff;
     /* 显示手状 */
    cursor: pointer;
}
</style>