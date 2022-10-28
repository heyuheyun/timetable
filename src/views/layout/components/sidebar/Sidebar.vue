<template>
    <div class="bar-wrap" ref="barWrap">
        <!-- siderBarLogo -->
        <div class="info-header" ref="headDiv" v-show="setStore.siderLogoShow">
            <img class="siderLogo" src="@/assets/logo.png">
            <p> vue timetable </p>
        </div>

        <!-- 菜单项 -->
        <ItemMenu v-for="menu in userStore.userRoutes" :item="menu" :menuHover="menuHover" :changeMenuTip="changeMenuTip" :key="menu.path+'-'+menu.name" />
    </div>

    <!-- 缩略显示侧边栏时的标题提示 -->
    <div class="menu-tip" ref="menuTip" v-show="setStore.siderbarThumbnail">
        <div class="triangle"></div>
        <div class="tip" ref="tipText"></div>
    </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { useUserStore, useSetStore } from "@/store";
import ItemMenu from "./ItemMenu";

const userStore = useUserStore();
const setStore = useSetStore();
const barWrap = ref();
const headDiv = ref();
const menuTip=ref();
const tipText=ref();
const menuHover = ref(false);

userStore.getUserRoutes();

//改变标题提示的位置
function changeMenuTip(y,title=false){
    if(setStore.siderbarThumbnail){
        if(title) {
            menuTip.value.style.display="block";
            menuTip.value.style.top=y+13+"px";
            tipText.value.innerText=title;
        }
        else menuTip.value.style.display="none";
    }
}

watch(
    () => setStore.siderbarThumbnail,
    //是否略缩显示侧边栏
    openHover => {
        if (openHover) {
            barWrap.value.style.width = 60 + "px";
            menuHover.value = true;
            headDiv.value.style.justifyContent = "left";
        } else {
            barWrap.value.style.width = 200 + "px";
            menuHover.value = false;
            headDiv.value.style.justifyContent = "center";
        }
    }
);
</script>

<style lang="less" scoped>
.bar-wrap {
    width: 200px;
    height: 100vh;
    overflow-y: auto;
    transition: width 0.5s;
    background-color: @theme-deep-color1;
    border-right: .5px solid rgb(235, 235, 235);
    &::-webkit-scrollbar {
        display: none;
    }

    .info-header {
        background-color: @theme-main-color3;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        .siderLogo{
            height:28px;
            margin: 0px 16px;
        }

        .icon {
            font-size: 28px;
            margin: 0px 16px;
            color: @theme-main-color2;
        }

        p {
            margin-right: 16px;
            color: white;
            font-size: calc(@baseSize * 1.3);
            text-align: center;
            white-space: nowrap;
            font-family: "Times New Roman";
            text-transform: capitalize;
        }
    }
}

.menu-tip {
    display: none;
    z-index: 9;
    position: absolute;
    top: 90px;
    left: 70px;
    white-space: nowrap;

    .triangle {
        transform: translateY(-50%);
        display: inline-block;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-left: none;
        border-right-color: @theme-deep-color2;
    }

    .tip {
        display: inline-block;
        vertical-align: bottom;
        border-radius: 5px;
        padding: 2px 12px;
        height: 30px;
        line-height: 30px;
        color: @theme-sider-font;
        background-color: @theme-deep-color2;
    }
}
</style>
