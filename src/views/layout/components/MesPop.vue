<template>
    <div class="mes-pop" v-for="item in mesList" :class="item.type" :key="item.id">
        <i class="iconfont pop-icon" :class="{ 'icon-chenggong1': item.type == 'pop-success', 'icon-tanhao1': item.type == 'pop-tip', 'icon-shibai': item.type == 'pop-err' }"></i>
        {{ item.text }}
    </div>
</template>

<script setup>
import { reactive } from "vue";
import Bus from "@/utils/bus";

//信息提示列表
const mesList = reactive([]);
let mesid = 1;
let typeMap = {
    success: "pop-success",
    tip: "pop-tip",
    err: "pop-err",
};

//添加信息提示
function showMesPop({ type = "tip", text = "test" } = {}) {
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
</style>
