<template>
    <div class="appmain">
        <div class="appcart selcart">
            <SelectBlock atr="校区" describe="请选择校区" v-model="selParams.campus" :change="classRoomQuery">
                <li svalue="ds">东区</li>
                <li svalue="zq">主校区</li>
                <li svalue="ql">启林</li>
                <li svalue="xq">西校区</li>
            </SelectBlock>
            <SelectBlock atr="月份" describe="请选择月份" v-model="selParams.month">
                <li v-for="i in 3">{{ date.getMonth() + i }}</li>
            </SelectBlock>
            <SelectBlock atr="日期" describe="请选择日期" v-model="selParams.day" :change="classRoomQuery">
                <li v-for="i in dataLimt">{{ i }}</li>
            </SelectBlock>
            <SelectBlock atr="节次" describe="节次筛选" v-model="selParams.timeslot">
                <li v-for="i in 13">{{ i }}</li>
            </SelectBlock>
        </div>

        <div class="appcart">
            <table class="classroom-table">
                <tr>
                    <th class="cla-1">区域</th>
                    <th class="cla-2">教室编号</th>
                    <th class="cla-3">节次</th>
                    <th class="cla-4">安排</th>
                    <th class="cla-5">操作</th>
                </tr>
                <tr v-show="classRoomQueryList.list.length == 0"><td class="nodata" colspan="5"> No Data </td></tr>
                <tr v-for="item in classRoomQueryList.list" :key="item.Cid">
                    <td>{{ areaMap[item.area] }}</td>
                    <td>{{ item.Cid }}</td>
                    <td>{{ selParams.timeslot }}</td>
                    <td>{{ item.arrangeList[selParams.timeslot * 1] }}</td>
                    <td><button class="reserve-bt" :class="{ banbt: item.arrangeList[selParams.timeslot * 1] !== '空闲' }" @click="reserveRoom(item)">预 定</button></td>
                </tr>
            </table>

            <div class="pagination-wrap" v-if="classRoomQueryList.totalPage > 0">
                <span>
                    <Pagination :current_page="classRoomQueryList.pageNo" :totel_page="classRoomQueryList.totalPage" :continues="5" :change_page="changePage"> </Pagination>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import SelectBlock from "@/components/SelectBlock.vue";
import { reClassRoomQuery } from "@/api/common.js";
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import Bus from "@/utils/bus";

const router = useRouter();
const date = new Date();
//获取输入年月的天数
function getDayLimt(year, month) {
    if (month == 2) {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
            return 29;
        } else return 28;
    }
    const dayList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayList[month - 1];
}
const dataLimt = ref(getDayLimt(date.getFullYear(), date.getMonth() + 1));
const areaMap = {
    ds: "东区",
    zq: "主校区",
    ql: "启林",
    xq: "西校区",
};

const selParams = reactive({
    campus: "",
    month: date.getMonth() + 1,
    day: date.getDate(),
    filter: "",
    timeslot: 1,
});
const classRoomQueryList = reactive({
    totalPage: 0,
    pageNo: 1,
    list: [],
    filterList: [],
});

//换页
function changePage(value) {
    classRoomQueryList.pageNo = value;
    classRoomQuery();
}

//获取数据
async function classRoomQuery() {
    if (selParams.campus && selParams.month && selParams.day) {
        let params = {
            classArea: selParams.campus,
            month: selParams.month,
            day: selParams.day,
            page: classRoomQueryList.pageNo,
            filter: selParams.filter,
        };
        const result = await reClassRoomQuery(params);
        if (result.code && result.code === 200) {
            classRoomQueryList.list = result.data.classRoomQueryList;
            classRoomQueryList.totalPage = result.data.totalPage * 1;
            classRoomQueryList.pageNo = result.data.pageNo * 1;
        } else console.log("err", result);
    }
}

//跳转预定教室页面
function reserveRoom(item) {
    if (item.arrangeList[selParams.timeslot * 1] !== "空闲"){
        Bus.$emit('popMes',{type:'err',text:'当前教室不可用'});
        return;
    } 
    router.push({
        name: "ArrangeClassroom",
        params: {
            campus: selParams.campus,
            month: selParams.month,
            day: selParams.day,
            timeSlot: [selParams.timeslot],
            Cid: item.Cid,
        },
    });
}

//月份更新时更新每月天数
watch(
    () => selParams.month,
    value => {
        dataLimt.value = getDayLimt(date.getFullYear(), value);
        selParams.day = null;
    }
);
</script>

<style lang="less" scoped>
.selcart:deep(.select-wrap) {
    margin-right: 16px;

    .select {
        width: 126px;
    }
}

.classroom-table {
    width: 100%;
    outline: 1px solid rgb(226, 226, 226);

    .cla-1 {
        width: 15%;
    }
    .cla-2 {
        width: 20%;
    }
    .cla-3 {
        width: 15%;
    }
    .cla-4 {
        width: 20%;
    }
    .cla-5 {
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

    .reserve-bt {
        padding: 6px 16px;
        background-color: @theme-main-color1;
        color: white;
        font-size: @baseSize;
        border: 0px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background-color: @theme-main-color2;
        }
    }
    .banbt {
        background-color: rgb(187, 187, 187);
        cursor: default;
        &:hover {
            background-color: rgb(187, 187, 187);
        }
    }

    .nodata {
        padding: 24px;
        text-align: center;
        font-size: 20px;
        color: rgb(194, 194, 194);
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
