import request from './request'

//登录
export function reLogin(params){
    return request.post('/login',params);
}

//获取用户信息
export function reUserInfo(){
    return request.get('/get/userinfo');
}

//退出登录
export function reLogout(){
    return request.get('/logout');
}

//获取登录历史
export function reLogHistory(page){
    return request.get(`/LogHistory/${page}`);
}

//获取教室查询结果
export function reClassRoomQuery(params){
    return request.get(`/ClassRoomQuery/${params.page}?month=${params.month}&day=${params.day}&classArea=${params.classArea}&filter=${params.filter}`);
}

//获取已预定的教室列表
export function reReserveClassroom(){
    return request.get('/ReserveClassroom');
}

//获取可用的预定教室列表
export function reUsableClassroom(params){
    return request.post('/UsableClassroom',params);
}

//新增教室预定
export function reAddReserveClassroom(params){
    return request.post('/AddReserveClassroom',params);
}

//获取预定的详细信息
export function reGetReserveDetail(id){
    return request.get(`/GetReserveDetail/${id}`);
}

//删除预定
export function reDeleteReserve(id){
    return request.get(`/DeleteReserve/${id}`);
}

//获取首页个人消息
export function reMyInform(num){
    return request.get(`/myInform/${num}`);
}

//获取首页公告
export function reGetNotice(num){
    return request.get(`/getNotice/${num}`);
}

//获取首页个人安排
export function reMyArrange(num){
    return request.get(`/getMyArrange/${num}`);
}