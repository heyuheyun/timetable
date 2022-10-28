<template>
    <div class="appmain">
        <div class="appcart selcart">
            <div class="selmode-wrap">
                <span class="selmode" :class="{ active: data.selMode === 'week' }" @click="changeMode('week')">按周次查询</span>
                <span class="selmode" :class="{ active: data.selMode === 'course' }" @click="changeMode('course')">按课程查询</span>
            </div>
            <SelectBlock atr="学期" describe="请选择" v-model="data.semester">
                <li>第一学期</li>
            </SelectBlock>
            <SelectBlock atr="周次" describe="请选择" v-model="data.modeParam" v-show="data.selMode == 'week'" :change="updata">
                <li v-for="i in 16">{{ i }}</li>
            </SelectBlock>
            <SelectBlock atr="课程" describe="请选择" v-model="data.modeParam" v-show="data.selMode == 'course'" :change="updata">
                <li>果树栽培学</li>
                <li>园艺产品储运学</li>
                <li>数据库原理</li>
                <li>数据结构</li>
                <li>大学体育3</li>
            </SelectBlock>
        </div>

        <transition name="cart-fade" mode="out-in">
            <div class="appcart" v-if="data.selMode == 'week'" key="week">
                <table class="apptable week-table">
                    <tr>
                        <th class="timeslot">节次</th>
                        <th>周一</th>
                        <th>周二</th>
                        <th>周三</th>
                        <th>周四</th>
                        <th>周五</th>
                        <th>周六</th>
                        <th>周日</th>
                    </tr>
                    <tr v-for="i in 13" :key="i">
                        <td>{{ i }}</td>
                        <td v-for="j in 7" v-show="arList.spanRule[j - 1][i - 1]" :rowspan="arList.spanRule[j - 1][i - 1]" :class="{ 'course-exist': arList.List[j.toString() + i] }" :key="j">
                            <div class="course-wrap" v-if="arList.List[j.toString() + i]">
                                <p class="course-name">{{ arList.List[j.toString() + i].course.course }}</p>
                                <p class="area-name">
                                    <span>{{ arList.List[j.toString() + i].course.area }}</span>
                                    <span>{{ arList.List[j.toString() + i].course.Cid }}</span>
                                </p>
                                <p>{{ arList.List[j.toString() + i].course.className }}</p>
                                <p class="course-timeslot">{{ arList.List[j.toString() + i].startSlot + "-" + arList.List[j.toString() + i].endSlot + " 节" }}</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="appcart" v-else key="course">
                <table class="apptable">
                    <tr>
                        <th>周次</th>
                        <th>区域</th>
                        <th>教室</th>
                        <th>时间</th>
                        <th>班级</th>
                    </tr>
                    <tr v-show="!arList.modeCourseData.arrange"><td class="nodata" colspan="5"> No Data </td></tr>
                    <tr v-for="(item, index) in arList.modeCourseData.arrange" :key="index">
                        <td>第{{ index + 1 }}周</td>
                        <td>{{ arList.modeCourseData.area }}</td>
                        <td>{{ arList.modeCourseData.Cid }}</td>
                        <td>{{ "周" + item[0] + " " + item[1] + "-" + item[item.length - 1] }} </td>
                        <td>{{ arList.modeCourseData.className }}</td>
                    </tr>
                </table>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import SelectBlock from "@/components/SelectBlock.vue";
import { reTeachSchedule } from "@/api/user";

/*
    此组件写的较早，模拟的数据较有规律且简单，且数据在后台写死无随机性
    学生部分的课程表更适应无规律的课程安排，数据随机模拟
*/

const defaultSpanRule_ = [
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 0],
    [4, 0, 0, 0, 2, 0, 4, 0, 0, 0, 3, 0, 0],
    [4, 0, 0, 0, 2, 0, 4, 0, 0, 0, 3, 0, 0],
];
const defaultSpanRule = JSON.stringify(defaultSpanRule_);

const arList = reactive({
    List: {},
    spanRule: JSON.parse(defaultSpanRule),
    modeCourseData: {},
});
const data = reactive({
    selMode: "week",
    semester: "第一学期",
    modeParam: "",
});

function changeMode(mode) {
    data.selMode = mode;
    data.modeParam = "";
    arList.List = {};
    arList.modeCourseData = {};
}

function updataSpanRule(courseList) {
    arList.spanRule = JSON.parse(defaultSpanRule);
    if (courseList.length === 0) return;
    let continue_ = 0;
    for (let item of courseList) {
        continue_ = item.weekArrange.length - 1;
        let weekSpan = arList.spanRule[item.weekArrange[0] - 1];
        weekSpan[item.weekArrange[1] - 1] = continue_;
        if (item.weekArrange[0] == 6 || (item.weekArrange[0] == 7 && item.weekArrange[1] == 3) || item.weekArrange[1] == 9) {
            if (weekSpan[item.weekArrange[1] - 3] == 4) weekSpan[item.weekArrange[1] - 3] = 2;
        }
        for (let j = 0; j < continue_ - 1; j++) {
            weekSpan[item.weekArrange[1] + j] = 0;
        }
    }
}
function updataList(courseList) {
    arList.List = {};
    for (let item of courseList) {
        let startSlot = item.weekArrange[1];
        let endSlot = startSlot + item.weekArrange.length - 2;
        let index = item.weekArrange[0].toString() + startSlot;
        arList.List[index] = {
            course: item,
            startSlot,
            endSlot,
        };
    }
}

async function updata() {
    const result = await reTeachSchedule({ ...data });
    if (result.code && result.code === 200) {
        if (data.selMode === "week") {
            updataSpanRule(result.data);
            updataList(result.data);
        }
        if (data.selMode === "course") {
            arList.modeCourseData = result.data;
            arList.modeCourseData.arrange = result.data.arrange.filter(item => {
                return item.length > 0;
            });
        }
    } else {
        console.log("err", result);
    }
}
</script>

<style lang="less" scoped>
.selcart {
    position: relative;
    margin-top: 56px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}
.appcart {
    box-shadow: 0px 5px 10px 1px rgba(184, 184, 184, 0.3);
}
.selcart:deep(.select-wrap) {
    margin-right: 20px;
}

.selmode-wrap {
    position: absolute;
    bottom: 100%;
    left: 0%;
    box-shadow: 0px -5px 5px 1px rgba(214, 214, 214, 0.3);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 100%;

    .selmode {
        display: inline-block;
        padding: 14px 18px;
        font-weight: bolder;
        color: rgb(109, 109, 109);
        cursor: pointer;
        &:hover {
            color: @theme-main-color2;
        }
    }
    .active {
        background-color: rgb(250, 250, 250);
        color: @theme-main-color2;
    }
}

.week-table {
    .timeslot {
        width: 5.5%;
    }
    th {
        width: 13.5%;
    }
    .course-exist {
        background-color: rgb(245, 245, 245);

        .course-wrap {
            color: rgb(100, 100, 100);

            p {
                margin-top: 8px;
            }
            .course-name {
                font-weight: bolder;
            }
            .area-name {
                color: rgb(150, 150, 150);
                font-size: 12px;

                span {
                    margin: 0px 4px;
                }
            }
            .course-timeslot {
                color: rgb(150, 150, 150);
            }
        }
    }
}

.cart-fade-enter-active,
.cart-fade-leave-active {
    transition: transform 0.5s, opacity 0.5s;
}
.cart-fade-enter-from {
    transform: translateX(-30px);
    opacity: 0;
}
.cart-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>
