<template>
    <div class="appmain">
        <div class="appcart">
            <p class="tip">以下是你近4个月的登录历史，如有异常请修改密码</p>
        </div>
        <div class="appcart">
            <table class="login-table">
                <tr>
                    <th class="log-method">登录方式</th>
                    <th class="log-mechine">设备名称</th>
                    <th class="log-system">系统</th>
                    <th class="log-place">登录地点</th>
                    <th class="log-time">登录时间</th>
                </tr>
                <tr v-for="item in data.historyList">
                    <td>{{ item.logMethods }}</td>
                    <td>{{ item.logMechine }}</td>
                    <td>{{ item.logSystem }}</td>
                    <td>{{ item.logPlace }}</td>
                    <td>{{ item.logTime }}</td>
                </tr>
            </table>

            <div class="pagination-wrap" v-if="data.totalPage > 0">
                <span>
                    <Pagination :current_page="data.pageNo" :totel_page="data.totalPage" :continues="3" :change_page="getHistory"> </Pagination>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import { reLogHistory } from "@/api/common.js";
import Pagination from "@/components/Pagination.vue";

const data = reactive({
    historyList: [],
    pageNo: 1,
    totalPage: 0,
});

async function getHistory(page = 1) {
    let result = await reLogHistory(page);
    if (result.code == 200) {
        data.historyList = result.data.logHistoryList;
        data.pageNo = result.data.pageNo * 1;
        data.totalPage = result.data.totalPage * 1;
    } else {
        console.log("err!");
    }
}

onBeforeMount(() => {
    getHistory(1);
});
</script>

<style lang="less" scoped>
.tip {
    color: rgb(114, 114, 114);
    font-size: @baseSize;
    margin: 12px 8px;
}
.login-table {
    width: 100%;
    outline: 1px solid rgb(226, 226, 226);

    .log-method {
        width: 15%;
    }
    .log-mechine {
        width: 20%;
    }
    .log-system {
        width: 15%;
    }
    .log-place {
        width: 20%;
    }
    .log-time {
        width: 30%;
    }

    th,
    td {
        padding: 16px 12px;
        font-size: @baseSize;
        outline: 1px solid rgb(226, 226, 226);
        text-align: center;
        color: rgb(99, 99, 99);
    }
    th {
        color: rgb(141, 141, 141);
        font-size: calc(@baseSize * 1.1);
        font-weight: bold;
    }
}
.pagination-wrap {
    margin-top: 16px;
    text-align: center;
    span {
        display: inline-block;
    }
}
</style>
