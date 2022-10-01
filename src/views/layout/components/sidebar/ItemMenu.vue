<template>
    <a class="linkto" v-if="!item.children || item.children.length == 0" @click="routeTo(item)" :class="{ active: item.name == route.name }"
    @mouseenter="changeTip(item,$event)" @mouseleave="changeTip(false,$event)">
        <span class="tab" v-for="i in tab"></span>
        <i class="iconfont icon" :class="item.meta.icon"></i>
        <span class="no-icon" v-if="!item.meta.icon" v-show="menuHover">
            <p>{{item.meta.title.slice(0,4)}}</p>
        </span>
        <span v-show="!menuHover">{{ item.meta.title }}</span>
    </a>

    <template v-else>
        <div class="menu-title" @click="menuclick" @mouseenter="changeTip(item,$event)" @mouseleave="changeTip(false,$event)">
            <span class="tab" v-for="i in tab"></span>
            <i class="iconfont icon" :class="item.meta.icon">
                <i :class="{'right-bottom':iconFold,'left-top':!iconFold}" v-show="menuHover"></i>
            </i>
            <span v-show="!menuHover">{{ item.meta.title }}</span>
            <i class="iconfont icon" v-show="!menuHover" :class="{'icon-unfold':iconFold,'icon-packup':!iconFold}"></i>
        </div>
        <div class="submenu">
            <!-- 递归调用以支持多级路由菜单 -->
            <ItemMenu v-for="subitem in item.children" :item="subitem" :tab="tab + 1" :menuHover="menuHover" :changeMenuTip="changeMenuTip" :key="item.path+'-'+item.name" />
        </div>
    </template>


</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
var iconFold=ref(true);

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    //缩进
    tab: {
        type: Number,
        default: 0,
    },
    menuHover: {
        type: Boolean,
        default: false,
    },
    changeMenuTip: {
        type: Function,
    },
});

//路由跳转
function routeTo(item) {
    if (item.meta.isLink) window.open(item.path);
    else router.push({ name: item.name });
}

//展开或折叠子菜单
function menuclick(event) {
    iconFold.value=!iconFold.value;
    let menu = event.currentTarget.nextElementSibling;

    if (menu.style.maxHeight == "0px" || menu.style.maxHeight === "") {
        let maxheight = getELHeigth(menu.children);
        menu.style.maxHeight = maxheight + "px";
    } else {
        menu.style.maxHeight = "0px";
    }
}
//获取子元素的高度
function getELHeigth(child) {
    let h = 0;
    for (let i = 0; i < child.length; i++) {
        if (child[i].className.indexOf("menu-title") != -1 || child[i].className.indexOf("linkto") != -1) {
            h += child[i].clientHeight;
        }
        if (child[i].className.indexOf("submenu") != -1) {
            h += getELHeigth(child[i].children);
        }
    }
    return h;
}

//改变标题提示的位置
function changeTip(item,event){
    let rect=event.currentTarget.getBoundingClientRect();
    if(!item) props.changeMenuTip(0,false);
    else props.changeMenuTip(rect.y,item.meta.title);
}
</script>

<style lang="less" scoped>
.linkto,
.menu-title {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    color: @theme-sider-font;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    height: @sidebarHeight;
    transition: background-color 0.5s;
    &:hover {
        background-color: @theme-deep-color2;
    }
    &:hover .menu-tip {
        display: block;
    }

    .icon {
        font-size: 20px;
        margin: 0px 20px;
        position:relative;

        .right-bottom,.left-top{
            position:absolute;
            display:inline-block;
            opacity: .3;
            bottom:-5px;
            right:-12px;
            width:0;
            height:0;
            border-width: 4px 4px 0px 4px;
            border-color: @theme-sider-font transparent transparent transparent;
            border-style: solid;
        }
        .left-top{
            border-width: 0px 4px 4px 4px;
            border-color: transparent transparent @theme-sider-font transparent;
        }
    }

    .no-icon{
        position:relative;
        width:40px;
        opacity: .7;
        left:-30px;
        text-align: center;
        flex:0 0 auto;

        p{
            display: inline-block;
            margin-left: 5px;
            font-size: 10px;
            max-width: 40px;
            line-height: 18px;
            letter-spacing:.4em;
            font-weight: bold;
            white-space: pre-wrap;
        }
    }

    span {
        display: inline-block;
        width: 100%;
        font-size: calc(@baseSize * 1);
    }

    .tab {
        display: inline-block;
        width: 20px;
    }
}

.submenu {
    max-height: 0px;
    transition: max-height 0.5s;
    overflow-y: clip;
    overflow-x: visible;
    background-color: @theme-deep-color3;
    .linkto:hover {
        background-color: @theme-deep-color4;
    }
}

.active {
    color: @theme-main-color1 !important;
    font-weight: bolder;
}
</style>
