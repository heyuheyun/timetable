<template>
    <div class="layout-wrap">
        <div>
            <!-- 信息弹出提示 -->
            <div class="mes-pop" v-for="item in mesList" :class="item.type" :key="item.id">
                <i class="iconfont pop-icon"
                    :class="{ 'icon-chenggong1': item.type == 'pop-success', 'icon-tanhao1': item.type == 'pop-tip', 'icon-shibai': item.type == 'pop-err' }"
                ></i>
                {{ item.text }}
            </div>
        </div>

        <!-- <div class="test">
            <div @click="Bus.$emit('popMes',{type:'err',text:'err'})">err</div>
            <div @click="Bus.$emit('popMes',{type:'success',text:'success'})">success</div>
            <div @click="Bus.$emit('popMes',{type:'tip',text:'tip'})">tip</div>
        </div> -->

        <div class="left">
            <!-- 侧边栏菜单 -->
            <Sidebar />
        </div>

        <div class="right">
            <!-- 顶部 -->
            <Navbar />
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
import { useUserStore, useSetStore } from "@/store";
import { reactive } from "vue";
import Bus from "@/utils/bus";

const setStore = useSetStore();
const userStore = useUserStore();
userStore.getUserRoutes();

//操作提示列表
const mesList = reactive([]);
var mesid = 1;

function showMesPop({ type = "tip", text = "test" } = {}) {
    let typeMap = {
        success: "pop-success",
        tip: "pop-tip",
        err: "pop-err",
    };
    mesList.push({
        text,
        type: typeMap[type],
        id: mesid++,
    });
    setTimeout(() => {
        mesList.shift();
    }, 3000);
}

//订阅信息弹出提示事件
Bus.$on("popMes", showMesPop);
</script>

<style lang="less" scoped>
.layout-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;

    .test {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1000;

        div {
            width: 50px;
            height: 50px;
            margin: 10px;
            background-color: rgb(199, 199, 199);
        }
    }

    .mes-pop {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 12px 66px 12px 26px;
        font-size: calc(@baseSize * 1.1);
        background-color: rgb(158, 158, 158);
        border-radius: 2px;
        animation: popmes 3s;
        animation-fill-mode: forwards;
        z-index: 1000;

        .pop-icon {
            font-size: calc(@baseSize * 1.1);
            padding-right: 20px;
        }
    }
    .pop-success {
        background-color: rgb(235, 255, 236);
        color: rgb(91, 173, 95);
        outline: 1px solid rgb(213, 235, 214);
    }
    .pop-tip {
        background-color: rgb(236, 245, 255);
        color: rgb(107, 172, 247);
        outline: 1px solid rgb(194, 207, 223);
    }
    .pop-err {
        background-color: rgb(255, 240, 240);
        color: rgb(218, 114, 114);
        outline: 1px solid rgb(238, 209, 209);
    }
    @keyframes popmes {
        0% {
            opacity: 0;
            top: 0%;
        }
        20% {
            opacity: 1;
            top: 15%;
        }
        80% {
            opacity: 1;
            top: 15%;
        }
        100% {
            opacity: 0;
            top: 0%;
        }
    }

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
