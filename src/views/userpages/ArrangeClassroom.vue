<template>
    <div class="appmain">
        <div class="appcart">
            <p class="title">当前预约</p>

            <!-- 预约的教室列表 -->
            <button class="reserve-bt" @click="addReserveShow = true">添加预约 +</button>
            <table class="apptable revarse-table">
                <tr>
                    <th>预约日期</th>
                    <th>区域</th>
                    <th>教室</th>
                    <th>节次</th>
                    <th>进度</th>
                    <th>预约操作</th>
                </tr>
                <tr v-show="roomList.list.length === 0"><td class="nodata" colspan="5"> No Data </td></tr>
                <tr v-for="item in roomList.list" :key="item.id">
                    <td>{{ item.date }}</td>
                    <td>{{ areaMap[item.area] }}</td>
                    <td>{{ item.Cid }}</td>
                    <td class="time-slot"><span v-for="i in item.timeSlot" class="timeslot-span" :key="i">{{ i }}</span></td>
                    <td>
                        <span class="check" :class="{ 'check-true': item.check == 'true', 'check-false': item.check == 'false', 'check-wait': item.check == 'wait' }">
                            {{ checkMap[item.check] }}
                        </span>
                    </td>
                    <td>
                        <i class="detail-bt" @click="getDetail(item.id)">详情</i>
                        <i class="remove-bt" @click="showRemove(item.id)">删除</i>
                    </td>
                </tr>
            </table>

            <!-- 新增预约 -->
            <div class="appmask" v-show="addReserveShow">
                <div class="mesbox add-reserve">
                    <p class="title">添加预约</p>
                    <i class="close-bt" @click="addReserveShow = false">X</i>

                    <div class="mes-div">
                        <SelectBlock atr="月份" describe="请选择月份" v-model="reserveParams.month">
                            <li v-for="i in 3" :key="i">{{ date.getMonth() + i }}</li>
                        </SelectBlock>
                        <SelectBlock atr="日期" describe="请选择日期" v-model="reserveParams.day" :change="getUsableClassroom">
                            <li v-for="i in dataLimt" :key="i">{{ i }}</li>
                        </SelectBlock>
                    </div>
                    <div class="mes-div">
                        <SelectBlock atr="节次" describe="添加最多3个节次" :change="changeTimeSlot">
                            <li v-for="i in 13">{{ i }}</li>
                        </SelectBlock>
                        <span class="time-label" v-for="i in reserveParams.timeslot" :key="i"> {{ i }}<i class="label-close" @click="changeTimeSlot(i, true)">X</i> </span>
                    </div>
                    <div class="mes-div">
                        <SelectBlock atr="校区" describe="请选择校区" v-model="reserveParams.campus" :change="getUsableClassroom">
                            <li svalue="ds">东区</li>
                            <li svalue="zq">主校区</li>
                            <li svalue="ql">启林</li>
                            <li svalue="xq">西校区</li>
                        </SelectBlock>
                        <SelectBlock atr="教室" describe="可用教室" v-model="reserveParams.Cid">
                            <li v-for="item in reserveParams.Cidlist" :key="item">{{ item }}</li>
                        </SelectBlock>
                    </div>
                    <div class="mes-div">
                        <span class="mes-span">备注</span>
                        <textarea v-model="reserveParams.remark" placeholder="添加备注" class="remark-textarea"></textarea>
                    </div>

                    <i class="comfirm-bt" @click="addReserve">确认</i>
                    <i class="cancel-bt" @click="addReserveShow = false">取消</i>
                </div>
            </div>

            <!-- 删除确认 -->
            <div class="appmask" v-show="removeReserveShow">
                <!-- 因为v-show的关系?，此元素就算放v-for="item in roomList.list"的元素中，也取不到正确的item值，所以放在这里 -->
                <div class="mesbox">
                    <p class="title">确认删除</p>
                    <i class="comfirm-bt" @click="removeReserve()">确认</i>
                    <i class="cancel-bt" @click="removeReserveShow = false">取消</i>
                </div>
            </div>

            <!-- 详情 -->
            <div class="appmask" v-show="detailShow">
                <div class="mesbox rese-detail">
                    <p class="title">详情</p>
                    <i class="close-bt" @click="detailShow = false">X</i>
                    <div class="mes-div">
                        <span class="mes-span">类型：</span>
                        <span class="mes-text">会议</span>
                    </div>
                    <div class="mes-div">
                        <span class="mes-span">备注：</span>
                        <span class="mes-text">{{ reserveDetail }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, watch, ref } from "vue";
import { reReserveClassroom, reUsableClassroom, reAddReserveClassroom, reGetReserveDetail, reDeleteReserve } from "@/api/common.js";
import SelectBlock from "@/components/SelectBlock.vue";
import { useRoute } from "vue-router";
import Bus from "@/utils/bus";

const route = useRoute();
const date = new Date();
//获取输入年月的天数
function getDayLimt(year, month) {
    if (month === 2) {
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
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
const checkMap = {
    wait: "审核中",
    true: "审核通过",
    false: "审核未通过",
};

const addReserveShow = ref(false);
const removeReserveShow = ref(false);
const detailShow = ref(false);
const reserveDetail = ref(null);
let deleteId = null;
let forbidWatchMonth = false;
const roomList = reactive({
    list: [],
});
const reserveParams = reactive({
    campus: "",
    month: date.getMonth() + 1,
    day: date.getDate(),
    timeslot: [],
    Cid: "",
    Cidlist: [],
    remark: "",
});

//获取预约信息
async function getdata() {
    const result = await reReserveClassroom();
    if (result.code && result.code === 200) {
        roomList.list = result.data;
    } else console.log("err", result);
}

//添加或删除节次
function changeTimeSlot(value, isRemove = false) {
    if (reserveParams.timeslot.indexOf(value * 1) === -1 && reserveParams.timeslot.length < 3) reserveParams.timeslot.push(value * 1);
    if (isRemove) {
        let index = reserveParams.timeslot.indexOf(value * 1);
        reserveParams.timeslot.splice(index, 1);
    }
    getUsableClassroom();
}

//获取可用教室列表
async function getUsableClassroom() {
    reserveParams.Cidlist = [];
    reserveParams.Cid = "";
    if (reserveParams.campus && reserveParams.month && reserveParams.day && reserveParams.timeslot.length > 0) {
        const params = {
            month: reserveParams.month,
            day: reserveParams.day,
            area: reserveParams.campus,
            timeslot: reserveParams.timeslot,
        };
        const result = await reUsableClassroom(params);
        if (result.code && result.code === 200) {
            reserveParams.Cidlist = result.data.Cidlist;
        } else console.log(result);
    }
}

//增加预约
async function addReserve() {
    if (reserveParams.Cid) {
        const params = { ...reserveParams };
        const result = await reAddReserveClassroom(params);
        if (result.code && result.code === 200) {
            getdata();
            Bus.$emit("popMes", { type: "success", text: "添加预约成功" });
        } else console.log("addReserve-err", result);
        addReserveShow.value = false;
    } else Bus.$emit("popMes", { type: "tip", text: "请选择教室" });
}

//打开确认删除的窗口
function showRemove(id) {
    removeReserveShow.value = true;
    deleteId = id;
}
//删除元素
async function removeReserve() {
    if (!deleteId) return console.log("删除元素id错误");
    const result = await reDeleteReserve(deleteId);
    if (result.code && result.code === 200) {
        getdata();
        Bus.$emit("popMes", { type: "success", text: "删除成功" });
    } else console.log("删除失败", result);
    removeReserveShow.value = false;
}

//获取详情
async function getDetail(id) {
    reserveDetail.value = null;
    detailShow.value = true;
    const result = await reGetReserveDetail(id);
    if (result.code && result.code === 200) {
        reserveDetail.value = result.data.remark;
    } else console.log("获取详情失败", result);
}

//月份更新时更新每月天数
watch(
    () => reserveParams.month,
    value => {
        if (forbidWatchMonth) {
            forbidWatchMonth = false;
            return;
        }
        dataLimt.value = getDayLimt(date.getFullYear(), value);
        reserveParams.day = null;
        reserveParams.Cidlist = [];
        reserveParams.Cid = "";
    }
);

onBeforeMount(() => {
    getdata();
    //如果是从教室查询页面的预约功能进入此页面，则打开预约页面
    if (route.params.Cid) {
        addReserveShow.value = true;
        forbidWatchMonth = true;
        reserveParams.campus = route.params.campus;
        reserveParams.month = route.params.month;
        reserveParams.day = route.params.day;
        reserveParams.timeslot.push(route.params.timeSlot[0] * 1);
        reserveParams.Cid = route.params.Cid;
    }
});
</script>

<style lang="less" scoped>
.title {
    color: rgb(148, 148, 148);
    font-size: calc(@baseSize * 1.2);
    font-weight: bolder;
    width: 80px;
    margin: auto;
    margin-bottom: 16px;
}

.reserve-bt {
    padding: 10px 20px;
    background-color: @theme-main-color1;
    color: white;
    font-size: calc(@baseSize * 1.2);
    border: 0px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: @theme-main-color2;
    }
}
.revarse-table {
    tr:hover {
        background: rgb(245, 245, 245);
    }

    .time-slot {
        width: 20%;

        .timeslot-span {
            display: inline-block;
            font-size: 12px;
            background-color: rgb(243, 241, 241);
            outline: 1px solid rgb(218, 216, 216);
            color: rgb(129, 129, 129);
            padding: 3px 8px;
            margin: 2px 6px;
            border-radius: 2px;
        }
    }

    .check {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 4px;
        text-align: center;
        font-size: 12px;
    }
    .check-true {
        background-color: rgb(235, 255, 236);
        color: rgb(91, 173, 95);
    }
    .check-false {
        background-color: rgb(255, 240, 240);
        color: rgb(218, 114, 114);
    }
    .check-wait {
        background-color: rgb(236, 245, 255);
        color: rgb(107, 172, 247);
    }

    .detail-bt,
    .remove-bt {
        display: inline-block;
        font-size: 12px;
        margin: 0px 12px;
        padding: 6px 12px;
        border-radius: 2px;
        cursor: pointer;
        background-color: rgb(233, 143, 143);
        color: rgb(255, 255, 255);
    }
    .detail-bt {
        background-color: @theme-main-color1;
    }
}

.add-reserve {
    width: 680px;

    .time-label {
        display: inline-block;
        margin: 0px 12px;
        padding: 6px 12px;
        border-radius: 2px;
        background-color: rgb(236, 245, 255);
        color: rgb(107, 172, 247);

        .label-close {
            margin-left: 10px;
            font-size: 10px;
            cursor: pointer;
        }
    }

    .remark-textarea {
        border: 0;
        outline: 1px solid rgb(216, 216, 216);
        border-radius: 5px;
        padding: 4px;
        width: 400px;
        max-width: 600px;
        height: 100px;
        max-height: 180px;
        &::placeholder {
            color: rgb(218, 218, 218);
        }
    }
}

:deep(.select-wrap) {
    margin-right: 16px;

    .select {
        width: 126px;
    }
}

.rese-detail {
    padding-bottom: 26px !important;
}
</style>
