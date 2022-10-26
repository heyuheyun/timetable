<template>
    <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
            <keep-alive :include="keepAliveName.join(',')">
                <component :key="route.name" :is="Component" />
            </keep-alive>
        </transition>
    </router-view>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { cacheViewList, keepAliveName } from '@/utils/cacheViews';

const route = useRoute();
const reloadList = ["/404", "/401", "/login"];

watch(
    () => route.path,
    value => {
        //处理疑是vue3的bug，具体为：当transition的mode为out-in时，若从二级路由跳出时还存在缓存则vue会报错。vue2中未发现此问题。
        if (reloadList.indexOf(value) != -1) location.reload();
        //如果新的路由可被缓存则加入缓存
        if (route.meta && route.meta.cache) {
            if (!keepAliveName.includes(route.name)) {
                cacheViewList.push({
                    name:route.name,
                    path:route.path,
                    meta:JSON.parse(JSON.stringify(route.meta)),
                });
            }
        }
    }
);
</script>

<style lang="less" scoped>
.page-fade-enter-active,
.page-fade-leave-active {
    transition: transform 0.5s, opacity 0.5s;
}
.page-fade-enter-from {
    transform: translateX(-30px);
    opacity: 0;
}
.page-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>
