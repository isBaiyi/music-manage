<template>
    <div>
        <the-header></the-header>
        <the-aside></the-aside>
        <div class="content-box" :class="{'content-collapse':collapse}">
             <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TheHeader from './TheHeader';
import TheAside from './TheAside';
import bus from "../assets/js/bus"

export default {
    components:{
        TheHeader,
        TheAside
    },
    data(){
        return {
            collapse: false
        }
    },
    created(){
        // 通过bus进行组件间的通信来折叠侧边栏  --> 根据接收 TheHeader 中传过来的信息
        bus.$on('collapse', msg => {
        this.collapse = msg
        })
    }
}
</script>