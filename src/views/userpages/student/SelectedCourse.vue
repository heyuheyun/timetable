<template>
    <div class="appmain">
        <div class="appcart courselist-wrap">
            <h2 class="title">第一学期 已选课程</h2>
            <button class="selbt" @click="router.push({ name: 'SelectCourse' })">选课 +</button>
            <table class="apptable">
                <tr>
                    <th>课程名称</th>
                    <th>教师</th>
                    <th>节次</th>
                    <th>教室</th>
                    <th>学分</th>
                    <th>操作</th>
                </tr>
                <tr v-show="data.courseList.length == 0"><td class="nodata" colspan="6"> No Data </td></tr>
                <tr v-for="item in data.courseList" :key="item.id">
                    <td>{{ item.courseName }}</td>
                    <td>{{ item.teacher }}</td>
                    <td>{{ item.timeslot }}</td>
                    <td>{{ item.classroom }}</td>
                    <td>{{ item.credit }}</td>
                    <td>
                        <i class="iconfont icon-shanchu" :class="{ 'bt-active': !item.isNecess }" @click="confirmCancel(item)"></i>
                    </td>
                </tr>
            </table>
        </div>

        <div class="appmask" v-show="data.maskShow">
            <div class="mesbox">
                <p class="title">确认取消</p>
                <i class="comfirm-bt" @click="cancelCourse()">确认</i>
                <i class="cancel-bt" @click="data.maskShow = false">取消</i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import { reSelectCourse, reSelectOrCancelCourse } from "@/api/user.js";
import { useRouter } from "vue-router";
import Bus from "@/utils/bus";

const router = useRouter();

const data = reactive({
    courseList: [],
    maskShow: false,
    toBeCancel: null,
});

//获取课程数据
async function updataData() {
    const result = await reSelectCourse();
    if (result.code && result.code == 200) {
        data.courseList = result.data;
    } else console.log("err", result);
}

//取消确认
function confirmCancel(item) {
    if (item.isNecess) {
        Bus.$emit("popMes", { type: "tip", text: "必修课程不可取消" });
        return;
    }
    data.maskShow = true;
    data.toBeCancel = item.courseName;
}
//取消课程
async function cancelCourse() {
    const result = await reSelectOrCancelCourse({
        action: "cancel",
        courseName: data.toBeCancel,
    });
    data.toBeCancel = null;
    data.maskShow = false;
    if (result.code && result.code == 200) {
        Bus.$emit("popMes", { type: "success", text: "取消课程成功" });
        updataData();
    } else console.log("err", result);
}

onBeforeMount(() => {
    updataData();
});
</script>

<style lang="less" scoped>
.courselist-wrap {
    .title {
        color: rgb(148, 148, 148);
        font-size: calc(@baseSize * 1.2);
        font-weight: bolder;
        width: 180px;
        margin: auto;
        margin-bottom: 16px;
    }

    .selbt {
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
}

.icon-shanchu {
    display: inline-block;
    color: white;
    font-size: 14px;
    background-color: rgb(185, 185, 185);
    padding: 6px 16px;
    border-radius: 4px;
}
.bt-active {
    background-color: rgb(218, 100, 100);
    cursor: pointer;
    &:hover {
        background-color: rgb(204, 139, 139);
    }
}

.apptable {
    tr:hover {
        background-color: rgb(241, 241, 241);
    }
}
</style>
