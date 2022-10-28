<template>
    <div class="appmain">
        <div class="appcart selcart">
            <div class="selmode-wrap">
                <span class="selmode" :class="{ active: params.selMode === 'week' }" @click="changeMode('week')">按周次查询</span>
                <span class="selmode" :class="{ active: params.selMode === 'course' }" @click="changeMode('course')">按课程查询</span>
            </div>
            <SelectBlock atr="学期" describe="请选择" v-model="params.semester">
                <li>第一学期</li>
            </SelectBlock>
            <SelectBlock atr="周次" describe="请选择" v-model="params.selParam" v-show="params.selMode === 'week'" :change="updata">
                <li v-for="i in 16">{{ i }}</li>
            </SelectBlock>
            <SelectBlock atr="课程" describe="请选择" v-model="params.selParam" v-show="params.selMode === 'course'" :change="updata">
                <li>蔬菜栽培学(各论)</li>
                <li>园艺产品储运学</li>
                <li>插花艺术</li>
                <li>数据结构</li>
                <li>计算机组成原理</li>
                <li>计算机系统</li>
                <li>计算机网络</li>
            </SelectBlock>
        </div>

        <transition name="cart-fade" mode="out-in">
            <!-- 周次模式视图 -->
            <div class="appcart" v-if="params.selMode === 'week'" key="week">
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
                    <tr v-for="i in 13" class="timeslot-row" :key="i">
                        <td>{{ i }}</td>
                        <td v-for="j in 7" v-show="spanRule[j - 1][i - 1]" :rowspan="spanRule[j - 1][i - 1]" :class="{ 'course-exist': data.weekItemSite[j.toString() + i] }" :key="j">
                            <div class="course-wrap" v-if="data.weekItemSite[j.toString() + i]">
                                <p class="course-name" @click="intoCourseList(data.weekItemSite[j.toString() + i].course)">{{ data.weekItemSite[j.toString() + i].course }}</p>
                                <p>{{ data.weekItemSite[j.toString() + i].arrange.teacher }}</p>
                                <p class="area-name">
                                    <span>{{ data.weekItemSite[j.toString() + i].arrange.area }}</span>
                                    <span>{{ data.weekItemSite[j.toString() + i].arrange.Cid }}</span>
                                </p>
                                <p class="course-timeslot">{{ data.weekItemSite[j.toString() + i].arrange.date }}</p>
                                <p class="course-timeslot">{{ i + "-" + (i + spanRule[j - 1][i - 1] - 1) + " 节" }}</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <!-- 课程模式视图 -->
            <div class="appcart" v-else key="course">
                <table class="apptable course-table">
                    <tr>
                        <th>周次</th>
                        <th>教室</th>
                        <th>时间</th>
                        <th>节次</th>
                        <th>教师</th>
                        <th>操作</th>
                    </tr>
                    <tr v-show="!data.courseList.length"><td class="nodata" colspan="5"> No Data </td></tr>
                    <tr v-for="item in data.courseList">
                        <td>第{{ item.week }}周</td>
                        <td>{{ item.area }}&nbsp;{{ item.Cid }}</td>
                        <td>{{ item.date }}</td>
                        <td class="time-slot">
                            <span v-for="i in item.timeslot" class="timeslot-span">{{ i }}</span>
                        </td>
                        <td>{{ item.teacher }}</td>
                        <td>
                            <button class="bt" @click="Bus.$emit('popMes', { type: 'tip', text: '待开发' })">请假</button>
                        </td>
                    </tr>
                </table>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import SelectBlock from "@/components/SelectBlock.vue";
import { reTimetable } from "@/api/user";
import Bus from "@/utils/bus";

const params = reactive({
    selMode: "week",
    semester: "第一学期",
    selParam: "",
});
const data = reactive({
    courseList: [],
    weekList: [],
    weekItemSite: {},
});

//改变查询模式
function changeMode(mode) {
    params.selMode = mode;
    params.selParam = "";
    data.courseList = [];
    data.weekList = [];
    data.weekItemSite = {};
}

//从周次查询模式进入课程查询模式
function intoCourseList(course) {
    changeMode("course");
    params.selParam = course;
    updata();
}

//更新课程在课程表对应的位置
function siteWeekItem() {
    data.weekItemSite = {};
    data.weekList.forEach(item => {
        let index = item.arrange.day.toString() + item.arrange.timeslot[0];
        Object.assign(data.weekItemSite,{ [index]:item })
    });
}

//获取数据
async function updata() {
    const result = await reTimetable({ ...params });
    if (result.code && result.code == 200) {
        if (params.selMode == "week") {
            data.weekList = result.data;
            siteWeekItem();
        }
        if (params.selMode == "course") {
            data.courseList = result.data[0].weekArrangeList;
        }
    } else {
        console.log("err", result);
    }
}

//计算表格的跨行规则
const spanRule = computed(() => {
    //初始化7*13的二维数组，数组中的项表示对应周次对应节次的表格跨行数
    const spanRule = new Array(7).fill(0).map(item => new Array(13).fill(0));
    for (let item of data.weekList) {
        //课程占用的节次
        let slotLen = item.arrange.timeslot.length;
        spanRule[item.arrange.day - 1][item.arrange.timeslot[0] - 1] = slotLen;
    }
    //进行默认跨行规则
    for (let day in spanRule) {
        let i = 0;
        while (i < 13) {
            //如果当前节次存在课程，跳到该课程结束的节次
            if (spanRule[day][i]) i = i + spanRule[day][i];
            else {
                let usableLen = 1; //当前节次需要跨的行，数值为1表示跨不了行
                if (i >= 10) {
                    //如果节次>=10，则尽可能跨更多的行
                    for (; i + usableLen < 13 && !spanRule[day][i + usableLen]; usableLen++);
                } else {
                    if (day < 5) {
                        //如果是非周末，则除11-13节外，尽可能的跨两行
                        if (!spanRule[day][i + 1] && i !== 5 && i + 1 !== 4 && i + 1 !== 10) usableLen = 2;
                    } else {
                        //如果是周六日，则在1-4节、7-10节，尽可能的跨4行
                        let lenLimit = 4;
                        if (i === 4 || i === 5) lenLimit = 6 - i;
                        for (; !spanRule[day][i + usableLen] && usableLen < lenLimit && i + 1 != 4 && i + 1 != 10; usableLen++);
                    }
                }
                spanRule[day][i] = usableLen;
                i = i + usableLen;
            }
        }
    }
    return spanRule;
});
</script>

<style lang="less" scoped>
.selcart {
    position: relative;
    margin-top: 56px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    &:deep(.select-wrap) {
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
}
.appcart.selcart {
    box-shadow: 0px 5px 10px 1px rgba(184, 184, 184, 0.3);
}

.week-table {
    .timeslot {
        width: 5.5%;
    }
    th {
        width: 13.5%;
    }
    .timeslot-row {
        height: 7%;
    }
    .course-exist {
        background-color: rgb(245, 245, 245);

        .course-wrap {
            color: rgb(100, 100, 100);

            p {
                margin-top: 4px;
            }
            .course-name {
                font-weight: bolder;
                cursor: pointer;
                &:hover {
                    color: @theme-main-color1;
                }
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

.course-table {
    .time-slot {
        width: 25%;

        .timeslot-span {
            display: inline-block;
            background-color: rgb(241, 241, 241);
            outline: 1px solid rgb(224, 224, 224);
            color: rgb(128, 128, 128);
            padding: 4px 8px;
            margin: 0px 12px;
            border-radius: 2px;
        }
    }
    .bt {
        display: inline-block;
        font-size: 12px;
        margin: 0px 12px;
        padding: 6px 12px;
        border: 0;
        border-radius: 2px;
        cursor: pointer;
        background-color: @theme-main-color1;
        color: rgb(255, 255, 255);
    }
    tr:hover {
        background-color: rgb(245, 245, 245);
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
