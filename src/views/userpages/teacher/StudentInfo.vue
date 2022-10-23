<template>
    <div class="appmain">
        <div class="appcart selcart">
            <SelectBlock atr="学期" describe="请选择" v-model="data.semester">
                <li>第一学期</li>
            </SelectBlock>
            <SelectBlock atr="课程" describe="请选择" v-model="data.course" :change="getCourseStudentList">
                <li>果树栽培学</li>
                <li>园艺产品储运学</li>
                <li>数据库原理</li>
                <li>数据结构</li>
                <li>大学体育3</li>
            </SelectBlock>
        </div>
        <div class="appcart">
            <table class="apptable">
                <tr>
                    <th>序号</th>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>学院</th>
                    <th>班级</th>
                </tr>
                <tr v-show="data.CourseStudentList.length == 0"><td class="nodata" colspan="5"> No Data </td></tr>
                <tr v-for="(item, index) in data.CourseStudentList">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.studentId }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.college }}</td>
                    <td>{{ item.class + "班" }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup>
import SelectBlock from "@/components/SelectBlock.vue";
import { reactive } from "vue";
import { reCourseStudentList } from "@/api/user";

const data = reactive({
    semester: "第一学期",
    course: "",
    CourseStudentList: [],
});

//获取学生信息
async function getCourseStudentList() {
    const result = await reCourseStudentList(data.course);
    if (result.code && result.code === 200) {
        data.CourseStudentList = result.data;
    } else console.log("err", result);
}
</script>

<style lang="less" scoped>
//改变选择器组件的默认样式
.selcart:deep(.select-wrap) {
    margin-right: 20px;
}
</style>
