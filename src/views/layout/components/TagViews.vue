<template>
    <div class="tag-wrap" v-show="setStore.tagViewsShow">
        <span class="tag" v-for="(item, index) in data.tagList" :key="item.name" :class="{ active: route.name == item.name }">
            <span class="tag-name" @click="router.push({ name: item.name })">{{ item.title }}</span>
            <span class="closebt" v-if="!item.isFix" @click="closeTag(index)">x</span>
        </span>
    </div>
</template>

<script setup>
import { useUserStore, useSetStore } from "@/store";
import { reactive, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { cacheViewList,initCache } from '@/utils/cacheViews';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const setStore = useSetStore();

initCache();

const data = reactive({
    tagList: [],
});

//根据缓存列表初始化标签列表
function initTag() {
    data.tagList = [];
    cacheViewList.forEach(item => {
        data.tagList.push({
            title: item.meta.title,
            name: item.name,
            isFix: true,
            isCache: true,
        });
    });
}

//关闭标签
function closeTag(index) {
    //如果当前标签是一个缓存项，则清除缓存
    if (data.tagList[index].isCache) {
        const tagName = data.tagList[index].name;
        for (let i in cacheViewList) {
            if (cacheViewList[i].name === tagName) {
                cacheViewList.splice(i, 1);
                break;
            }
        }
    }
    data.tagList.splice(index, 1);
    if (index - 1 >= 0) {
        router.push({ name: data.tagList[index - 1].name });
    }
}

watch(
    //路由变化时，添加标签项
    () => route.path,
    () => {
        for (let item of data.tagList) {
            if (item.name == route.name) return;
        }
        data.tagList.push({
            title: route.meta.title,
            name: route.name,
            isCache: route.meta.cache,
        });
    }
);
watch(
    //角色改变时初始标签
    () => userStore.role,
    () => {
        initTag();
    }
);

onBeforeMount(() => {
    initTag();
});
</script>

<style lang="less" scoped>
.tag-wrap {
    z-index: 1;
    width: 100%;
    padding: 0px 6px;
    box-shadow: 1px 3px 3px 1px rgb(230, 230, 230);

    .tag {
        display: inline-block;
        outline: 1px solid rgb(218, 218, 218);
        padding: 4px 8px;
        margin: 6px 6px;
        border-radius: 1px;
        font-size: @baseSize;

        .tag-name {
            cursor: pointer;
            color: grey;
        }

        .closebt {
            display: inline-block;
            padding: 2px 5px;
            line-height: 1;
            margin-left: 8px;
            vertical-align: top;
            color: rgb(221, 221, 221);
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
                color: @theme-main-color1;
            }
        }
    }

    .active {
        background-color: rgb(104, 192, 104);
        color: white;

        .tag-name:before {
            content: "";
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 6px;
            margin-bottom: 2px;
            background-color: white;
            vertical-align: middle;
        }
        .tag-name {
            color: white;
        }
        .closebt {
            color: white;
        }
    }
}
</style>
