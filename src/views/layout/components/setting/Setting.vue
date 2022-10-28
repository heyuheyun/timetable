<template>
    <Transition name="setfade">
        <div class="mask" v-show="setStore.setShow" @click="setStore.setShow = false">
            <div class="setting" @click.stop="">
                <div class="set-wrap">
                    <div class="title">
                        <h1>配置选项</h1>
                        <i @click="setStore.setShow = false">x</i>
                    </div>

                    <div class="cut">
                        <span></span>
                        <p>项目设置</p>
                        <span></span>
                    </div>
                    <div class="select">
                        <p>开启TagsView</p>
                        <span class="switch" @click="setStore.tagViewsShow = !setStore.tagViewsShow" :class="{ sl: setStore.tagViewsShow }">
                            <span class="traball"></span>
                            <span class="swball"></span>
                        </span>
                    </div>
                    <div class="select">
                        <p>开启SideBarLogo</p>
                        <span class="switch" :class="{ sl: setStore.siderLogoShow }" @click="setStore.siderLogoShow = !setStore.siderLogoShow">
                            <span class="traball"></span>
                            <span class="swball"></span>
                        </span>
                    </div>
                    <div class="select">
                        <p>固定顶部</p>
                        <span class="switch" :class="{ sl: setStore.fixNavbar }" @click="setStore.fixNavbar = !setStore.fixNavbar">
                            <span class="traball"></span>
                            <span class="swball"></span>
                        </span>
                    </div>

                    <div class="cut">
                        <span></span>
                        <p>主题设置</p>
                        <span></span>
                    </div>
                    <div class="theme-wrap" ref="themeWrap">
                        <span class="color blue" @click="setTheme('themeBlue', $event)">
                            <p class="color-name">经典蓝</p>
                            <div class="edge"></div>
                        </span>
                        <span class="color green active" @click="setTheme('themeGreen', $event)">
                            <p class="color-name">白翠绿</p>
                        </span>
                        <span class="color gold" @click="setTheme('goldAndgrey', $event)">
                            <p class="color-name">金灰调</p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from "vue";
import { changetheme } from "@/style/theme";
import { useSetStore } from "@/store";

const setStore = useSetStore();
const themeWrap = ref();

//改变主题
function setTheme(name, event) {
    const spanList = themeWrap.value.children;
    for (let i = 0; i < spanList.length; i++) {
        if (spanList[i].className.indexOf("active") !== -1) {
            spanList[i].className = spanList[i].className.replace("active", "");
        }
    }
    event.target.className += " active";
    changetheme(name);
}
</script>

<style lang="less" scoped>
.setting {
    position: absolute;
    right: 0%;
    height: 100%;

    .set-wrap {
        box-sizing: border-box;
        width: 340px;
        height: 100%;
        background-color: white;
        padding: 24px 20px;

        .title {
            margin-bottom: 38px;

            h1 {
                display: inline-block;
                width: 270px;
                font-size: calc(@baseSize * 1.6);
                color: rgb(110, 110, 110);
            }
            i {
                display: inline-block;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 22px;
                color: rgb(161, 161, 161);
                cursor: pointer;
                &:hover {
                    color: @theme-main-color1;
                }
            }
        }

        .cut {
            margin-top: 18px;

            span {
                display: inline-block;
                width: 80px;
                height: 0px;
                border: 1px solid rgba(201, 201, 201, 0.5);
            }
            p {
                display: inline-block;
                width: 100px;
                text-align: center;
                font-size: calc(@baseSize * 1.2);
                color: rgb(133, 133, 133);
                margin: 10px 16px;
            }
        }

        .select {
            display: flex;
            margin: 12px 0px;

            p {
                width: 100%;
                font-size: calc(@baseSize * 1);
            }

            .switch {
                display: inline-block;
                margin: 2px 0px;
                width: 56px;
                height: 26px;
                white-space: nowrap;
                background-color: rgb(167, 167, 167);
                border-radius: 13px;
                cursor: pointer;
                transition: background-color 0.5s;

                .traball {
                    width: 0px;
                    display: inline-block;
                    margin-right: 1px;
                    width: 0px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: transparent;
                    transition: width 0.5s;
                }

                .swball {
                    display: inline-block;
                    margin: 3px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: white;
                }
            }
            .sl {
                background-color: @theme-main-color1;

                .traball {
                    width: 20px;
                }
            }
        }

        .theme-wrap {
            width: 100%;

            .color {
                position: relative;
                display: inline-block;
                margin: 14px 12px;
                width: 75px;
                height: 80px;
                border-radius: 10px;
                cursor: pointer;
                overflow: hidden;

                .color-name {
                    position: absolute;
                    bottom: 0%;
                    width: 100%;
                    height: 28px;
                    line-height: 28px;
                    font-size: 14px;
                    background-color: rgba(255, 255, 255, 0.5);
                    color: white;
                    text-align: center;
                }
            }

            .blue {
                background-color: rgb(64, 158, 255);
                color: rgb(104, 180, 255);
                &:hover {
                    box-shadow: 0px 0px 10px 1px rgb(104, 180, 255);
                }
            }
            .green {
                background-color: rgb(134, 192, 147);
                color: rgb(102, 156, 113);
                &:hover {
                    box-shadow: 0px 0px 10px 1px rgb(102, 156, 113);
                }
            }
            .gold {
                background-color: rgb(95, 100, 107);
                color: rgb(143, 123, 62);
                &:hover {
                    box-shadow: 0px 0px 10px 1px rgb(143, 123, 62);
                }
            }

            .active {
                box-shadow: 0px 0px 10px 1px;
            }
        }
    }
}

.mask {
    position: fixed;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.4);
}

.setfade-enter-active, .setfade-leave-active {
    transition: opacity 0.5s;
}

.setfade-enter-from, .setfade-leave-to {
    opacity: 0;
}
.setfade-enter-active .setting, .setfade-leave-active .setting {
    transition: transform 0.5s, opacity 0.5s;
}
.setfade-enter-from .setting, .setfade-leave-to .setting {
    transform: translateX(100%);
    opacity: 0;
}
</style>
