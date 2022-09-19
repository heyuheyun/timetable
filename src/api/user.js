import request from './request'

//获取课程学生列表
export function reCourseStudentList(courseName){
    return request.get(`/CourseStudentList?courseName=${courseName}`);
}

//获取教学安排
export function reTeachSchedule(params){
    return request.get(`/teachSchedule?selMode=${params.selMode}&modeParam=${params.modeParam}`);
}

//获取课程表
export function reTimetable(params){
    return request.get(`/getTimetable?selMode=${params.selMode}&selParam=${params.selParam}`);
}

//获取已选课程
export function reSelectCourse(){
    return request.get('/getSelectCourse');
}

//获取可选的课程列表
export function reOptionCourse(){
    return request.get('/getOptionCourse');
}

//选择或取消选择课程
export function reSelectOrCancelCourse(params){
    return request.get(`/selectOrCancelCourse?action=${params.action}&courseName=${params.courseName}`);
}
