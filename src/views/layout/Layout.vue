<template>
    <div class="layout-wrap">

        <!-- 信息提示 -->
        <MesPop />

        <div class="left">
            <!-- 侧边栏菜单 -->
            <Sidebar />
        </div>

        <div class="right">
            <!-- 顶部 -->
            <Navbar />
            <!-- 面包屑 -->
            <TagViews />
            <!-- appmain -->
            <div class="appmain-wrap" :class="{ 'fix-header': setStore.fixNavbar }">
                <AppMain />
            </div>
        </div>

        <!-- 项目设置 -->
        <div class="mask" v-show="setStore.setShow" @click="setStore.setShow = false"></div>
        <Transition name="fade">
            <div class="setting" v-show="setStore.setShow">
                <Setting />
            </div>
        </Transition>
    </div>
</template>

<script setup>
import AppMain from "./components/AppMain";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Navbar from "./components/navbar/Navbar.vue";
import Setting from "./components/setting/Setting.vue";
import TagViews from "./components/TagViews.vue";
import MesPop from './components/MesPop.vue';
import { useUserStore, useSetStore } from "@/store";

const setStore = useSetStore();
const userStore = useUserStore();
userStore.getUserRoutes();

</script>

<style lang="less" scoped>
.layout-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;

    .left {
        display: inline-block;
        //flex:0 0 300px;
        //overflow-y: auto;
    }

    .right {
        display: flex;
        width: 100%;
        height: 100vh;
        flex-direction: column;
        flex-grow: 1;
        overflow-x: hidden;

        .appmain-wrap {
            height: 100%;
            flex-grow: 1;
            background-color: rgb(245, 245, 245);
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .fix-header {
            overflow-x: hidden;
        }
    }

    .setting {
        position: absolute;
        right: 0%;
        height: 100%;
        z-index: 9;
    }

    .mask {
        position: absolute;
        left: 0%;
        top: 0%;
        width: 100%;
        height: 100%;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.4);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: transform 0.5s, opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
