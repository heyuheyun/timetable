<template>
    <div class="nav-wrap">
        <!-- 缩略菜单 -->
        <i
            class="iconfont icon"
            @click="setStore.siderbarThumbnail = !setStore.siderbarThumbnail"
            :class="{ 'icon-outdent': !setStore.siderbarThumbnail, 'icon-indent': setStore.siderbarThumbnail }"
        ></i>

        <!-- 菜单层级显示 -->
        <span class="menu-level">
            <a class="menulink" @click="router.push({ name: data.menuNav.mainMenu.name })">{{ data.menuNav.mainMenu.meta.title }}</a>
            <a class="menulink sub" v-for="item in data.menuNav.subMenu" :key="item.meta.title" :class="{ last: !item.children }" 
            @click="router.push({ name: item.name })">{{item.meta.title}}</a>
        </span>

        <!-- 空白填充 -->
        <span class="blank-fill"></span>

        <!-- 搜索区 -->
        <span class="search-area">
            <input class="search-input" placeholder="菜单搜索" ref="searchInput" @input="updataSearchList" @blur="menuSearch(true, $event)" />
            <div class="gotoMenu-wrap" v-show="data.searchList">
                <div class="tri"></div>
                <div class="gotoMenu" v-for="item in data.searchList" @mousedown="router.push({ name: item.name })" :key="item.title">{{ item.title }}</div>
                <div class="nodata" v-show="data.searchList && data.searchList.length == 0">No Data</div>
            </div>
            <i class="iconfont icon-search right-icon" @mousedown="menuSearch(false, $event)"></i>
        </span>
        <!-- 全屏 -->
        <i class="iconfont icon-expand-alt right-icon" @click="fullScrean"></i>
        <!-- 改变字体设置 -->
        <i class="iconfont icon-font-size right-icon font-set" @click="showFontDiv">
            <div class="font-set-div" tabindex="-1" @blur="hiddenFontDiv" @mouseleave="setIsOut(true)" @mouseenter="setIsOut(false)" ref="fontDiv">
                <span>字体尺寸：</span>
                <input type="range" min="12" max="20" class="range" v-model="data.fontSize" @focus="test" />
                <button class="rbt" @click="changeFont"> 确定 </button>
                <div class="show-size" ref="showSize"> {{ data.fontSize }}px </div>
            </div>
        </i>
        <!-- 用户信息 -->
        <span class="user-area">
            <img src="@/assets/imgs/head_portrait.jpg" class="user-head-icon" />
            <p class="user-name">{{ userStore.userName }}</p>
            <i class="iconfont icon-angle-down user-arrow"></i>
            <div class="user-menu">
                <div class="menu" @click="router.push({name:'UserInfo'})">个人信息</div>
                <div class="menu roleSelect">角色(开发测试)
                    <div class="role-wrap">
                        <div @click="selectRole('admin')">管理员</div>
                        <div @click="selectRole('teacher')">教师</div>
                        <div @click="selectRole('student')">学生</div>
                    </div>
                </div>
                <div class="menu logout" @click="logout">退出登录</div>
            </div>
        </span>
        <!-- 设置 -->
        <i class="iconfont icon-cog-fill right-icon set-icon" @click="setStore.setShow = true"></i>
    </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore, useSetStore, useCacheViews } from "@/store";
import { reLogout } from "@/api/common.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const setStore = useSetStore();
const cacheViews = useCacheViews();

const showSize = ref();
const fontDiv = ref();
const searchInput = ref();
var fontSetDivisOut = false;

//获得当前菜单层级
function getMenuNav() {
    let pathArray = route.path.split("/");
    let mainMenu = null;
    let subMenu = [];
    userStore.userRoutes.forEach(item => {
        let temp = item.path.split("/");
        if (temp[1] == pathArray[1]) mainMenu = item;
    });
    let target = mainMenu;
    for (let i = 2; i < pathArray.length; i++) {
        let nextTarget = null;
        target.children.forEach(item => {
            if (item.path == pathArray[i]) {
                nextTarget = item;
            }
        });
        subMenu.push(nextTarget);
        target = nextTarget;
    }
    return {
        mainMenu,
        subMenu,
    };
}

//使网页全屏
function fullScrean(event) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        event.target.className = "iconfont icon-expand-alt right-icon";
    } else {
        document.documentElement.requestFullscreen();
        event.target.className = "iconfont icon-compress-alt right-icon";
    }
}

//用于决定div失去焦点时是否隐藏div
function setIsOut(value) {
    fontSetDivisOut = value;
}
//展示div
function showFontDiv() {
    fontDiv.value.style.display = "block";
    fontDiv.value.focus();
}
//失去焦点时隐藏div
function hiddenFontDiv() {
    if (!fontSetDivisOut) {
        fontDiv.value.focus();
        return;
    }
    fontDiv.value.style.display = "none";
    data.fontSize = document.body.style.getPropertyValue("--baseSize").slice(0, 2) || 14;
}
//改变字体大小
function changeFont() {
    document.body.style.setProperty(`--baseSize`, data.fontSize + "px");
    fontSetDivisOut = true;
    fontDiv.value.blur();
}

//更新搜索结果
function getSearchRoute(filevalue = "") {
    //如果输入为空则返回null不显示结果栏
    if (filevalue == "") return null;
    let routeArray = [];
    let getSubRoute = function (subRoutes, faname = "") {
        subRoutes.forEach(item => {
            let tmp = {
                title: faname == "" ? faname + item.meta.title : faname + ">" + item.meta.title,
                name: item.name,
            };
            if (tmp.title.indexOf(filevalue) != -1) {
                routeArray.push(tmp);
            }
            if (item.children) getSubRoute(item.children, tmp.title);
        });
    };
    getSubRoute(userStore.userRoutes);
    return routeArray;
}
function updataSearchList(event) {
    data.searchList = getSearchRoute(event.target.value);
}
//展开或关闭搜索区域
function menuSearch(blurFlag = false, event) {
    //使用mousedown代替click解决blur先执行的问题，阻止事件默认行为避免input聚焦后立即失焦
    event.preventDefault();
    if (blurFlag) {
        searchInput.value.style.width = 0;
        searchInput.value.style.padding = "0px";
        searchInput.value.value = null;
        data.searchList = getSearchRoute();
        return;
    }
    if (!searchInput.value.style.width || searchInput.value.style.width == "0px") {
        searchInput.value.style.width = 160 + "px";
        searchInput.value.style.padding = "0px 8px";
        searchInput.value.focus();
    } else {
        searchInput.value.blur();
    }
}

//退出登录
async function logout() {
    let result = await reLogout();
    console.log(result);
    userStore.updataToken(null);
    userStore.resetUserInfo();
    router.push("/login");
}

//更换角色
function selectRole(role) {
    userStore.role = role;
    const routes = router.getRoutes();
    let showMenu = [];
    //重新计算路由
    routes.forEach(item => {
        if (!item.meta.hideInMenu && item.path.match(/\//g).length == 1)
            if (!item.meta.limit || item.meta.limit.indexOf(userStore.role) != -1) showMenu.push(item);
    });
    userStore.userRoutes = showMenu;
    //初始缓存
    cacheViews.initCache();
    router.push("/");
}

const data = reactive({
    menuNav: getMenuNav(),
    searchList: getSearchRoute(),
    fontSize: document.body.style.getPropertyValue("--baseSize").slice(0, 2) || 14,
});

watch(route, () => {
    data.menuNav = getMenuNav();
});
watch(
    () => data.fontSize,
    value => {
        showSize.value.style.fontSize = value + "px";
    }
);
</script>

<style lang="less" scoped>
.nav-wrap {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid rgb(230, 230, 230);
    display: flex;
    align-items: center;

    .icon,
    .right-icon {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        padding: 0px 20px;
        color: rgb(49, 49, 49);
        cursor: pointer;
        &:hover {
            background-color: rgb(241, 241, 241);
        }
    }
    .right-icon {
        font-size: 16px;
        padding: 0px 8px;
    }
    .set-icon {
        margin-right: 16px;
    }
    .font-set {
        position: relative;

        .font-set-div {
            display: none;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 280px;
            line-height: 40px;
            padding: 10px 16px;
            box-shadow: 5px 5px 5px rgba(184, 184, 184, 0.3);
            cursor: default;
            border-radius: 5px;
            background-color: rgb(255, 255, 255);
            z-index: 2;
            &:focus-visible {
                outline: 0;
            }

            .show-size {
                margin: 12px 0px;
                height: 46px;
                line-height: 46px;
                text-align: center;
                border: 1px dashed black;
            }

            span {
                font-size: 14px;
            }

            input[type="range"] {
                height: 6px;
                cursor: pointer;
            }

            button {
                border: 0;
                width: 56px;
                height: 32px;
                border-radius: 3px;
                margin-left: 20px;
                cursor: pointer;
                background-color: @theme-main-color1;
                color: white;
                &:hover {
                    background-color: @theme-main-color2;
                }
            }
        }
    }

    .menu-level {
        display: inline-block;
        height: 50px;
        line-height: 50px;

        .menulink {
            display: inline-block;
            font-size: calc(@baseSize * 1);
            font-weight: bold;
            margin: 0px 4px;
            cursor: pointer;
            &:hover {
                color: @theme-main-color2;
            }
        }

        .sub:before {
            content: "/ ";
            display: inline-block;
            width: 16px;
        }

        .last {
            color: rgb(179, 179, 179);
            cursor: default;
            &:hover {
                color: rgb(179, 179, 179);
            }
        }
    }

    .blank-fill {
        display: inline-block;
        height: 100%;
        flex-grow: 1;
    }

    .search-area {
        position: relative;
        display: inline-block;
        height: 100%;
        text-align: right;
        padding-right: 50px;

        .search-input {
            width: 0px;
            height: 30px;
            border-color: @theme-main-color1;
            border-width: 0px;
            border-radius: 5px;
            margin-right: 12px;
            padding: 0px 8px;
            transition: width 0.5s;
            &:focus-visible {
                outline: 1px solid @theme-main-color1;
            }
        }
        input::placeholder {
            color: rgb(179, 179, 179);
        }

        .gotoMenu-wrap {
            position: absolute;
            min-width: 178px;
            padding: 6px 0px;
            box-shadow: 0px 0px 8px 3px rgba(184, 184, 184, 0.3);
            background-color: white;
            z-index: 2;

            .tri {
                position: absolute;
                left: 50%;
                bottom: 100%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border: 8px solid transparent;
                border-top: none;
                border-bottom-color: white;
            }

            .nodata {
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: rgb(196, 196, 196);
                font-size: 18px;
            }

            .gotoMenu {
                box-sizing: border-box;
                white-space: nowrap;
                text-align: left;
                color: @theme-main-color1;
                font-weight: bold;
                font-size: 14px;
                padding: 10px 20px;
                cursor: pointer;
                &:hover {
                    background-color: rgb(243, 243, 243);
                }
            }
        }
    }

    .user-area {
        position: relative;
        display: flex;
        height: 50px;
        align-items: center;
        margin: 0px 8px;
        cursor: pointer;
        &:hover {
            background-color: rgb(241, 241, 241);
        }
        &:hover .user-menu {
            display: block;
        }

        .user-name {
            display: inline-block;
            color: rgb(122, 122, 122);
            font-size: calc(@baseSize * 1.1);
        }

        .user-icon {
            color: @theme-main-color2;
            margin: 12px;
            font-size: 24px;
        }
        .user-head-icon {
            display: inline-block;
            width: 40px;
            margin: 12px;
            border-radius: 8px;
        }

        .user-arrow {
            margin-left: 6px;
            margin-right: 12px;
            font-size: 12px;
            opacity: 0.5;
        }

        .user-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 20%;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(184, 184, 184, 0.3);
            background-color: white;
            z-index: 2;

            .menu {
                height: 45px;
                line-height: 45px;
                font-size: calc(@baseSize * 1);
                color: rgb(88, 88, 88);
                padding: 0px 12px;
                cursor: pointer;
                &:hover {
                    background-color: rgb(223, 223, 223);
                }
            }
            .logout::before {
                display: block;
                content: "";
                border-top: 1px solid rgb(230, 230, 230);
                margin-top: 5px;
            }

            .roleSelect {
                position: relative;
                &:hover .role-wrap {
                    display: block;
                }

                .role-wrap {
                    display: none;
                    position: absolute;
                    right: 100%;
                    top: 0%;
                    background-color: white;
                    box-shadow: 0px 0px 10px rgba(184, 184, 184, 0.3);

                    div {
                        width: 60px;
                        height: 30px;
                        line-height: 30px;
                        padding: 4px 8px;
                        cursor: pointer;
                        &:hover {
                            background-color: rgb(211, 211, 211);
                        }
                    }
                }
            }
        }
    }
}
</style>
