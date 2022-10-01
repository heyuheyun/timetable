const express=require("express");
const resdata=require("./resdata");
const fs=require('fs');

const router=express.Router();
const date=new Date();

function random_int(start,end){
    return parseInt(Math.random()*(end-start+1)+start);
    
}
function padding(num) {
    return num < 10 ? '0' + num : num
}
function formalDate(year, month, day) {
    return [year, padding(month), padding(day)].join('-')
}

const infoMould={
    code:200,
    data:{},
    message:"成功",
    ok:true,
}

//登录
router.post('/login',(req,res)=>{
    if(req.body.role) resdata.userInfo.role=req.body.role;
    infoMould.data=resdata.loginSuccess;
    res.send(JSON.stringify(infoMould));
})

//获取用户信息
router.get('/get/userinfo',(req,res)=>{
    if(req.headers.token){
        infoMould.data=resdata.userInfo;
        res.send(JSON.stringify(infoMould));
    }
    else{
        let info={
            code:401,
            data:{},
            message:"无效token",
            ok:false,
        }
        res.send(JSON.stringify(info));
        console.log("无效的token请求");
    }
})

//退出登录
router.get('/logout',(req,res)=>{
    infoMould.data={ok:"ok"};
    res.send(JSON.stringify(infoMould));
})

//获取登录历史
router.get('/LogHistory/:page',(req,res)=>{
    if(resdata.logHistoryList.length==0){
        let num=random_int(14,64);
        let startDate=new Date();
        for(let i=0;i<num;i++){
            let logHistory={
                logMethods:resdata.loginHistory.logMethods[random_int(0,2)],
                logMechine:resdata.loginHistory.logMechine[random_int(0,3)],
                logSystem:resdata.loginHistory.logSystem[random_int(0,3)],
                //logTime:resdata.loginHistory.logTime[0],
                logTime:formalDate(startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate())+" 00:00:00",
                logPlace:resdata.loginHistory.logPlace[random_int(0,5)],
                id:random_int(1,10)+"0"+i,
            }
            resdata.logHistoryList.push(logHistory);
        }
    }
    if(req.params.page<1 || req.params.page>Math.ceil(resdata.logHistoryList.length/8)) res.send("错误请求页");
    else {
        infoMould.data={
            total:resdata.logHistoryList.length,
            pageSize:8,
            pageNo:req.params.page,
            totalPage:Math.ceil(resdata.logHistoryList.length/8),
            logHistoryList:resdata.logHistoryList.slice((req.params.page-1)*8,req.params.page*8)
        }
        res.send(JSON.stringify(infoMould));
    }
})

//获取教室查询结果
router.get('/ClassRoomQuery/:page',(req,res)=>{
    if(resdata.classRoomQueryList.length==0){
        for(let i=0;i<4;i++){
            for(let j=0;j<5;j++){
                for(let k=0;k<11;k++){
                    let arrangeList=[];
                    for(let n=0;n<13;n++){
                        let temp=resdata.classRoomQuery.timeSlot[random_int(0,4)];
                        arrangeList.push(temp);
                    }
                    let classRoom={
                        area:resdata.classRoomQuery.area[i],
                        Cid:`${resdata.classRoomQuery.area[i]}0${j+1}${k<9?"0"+(k+1):(k+1)}`,
                        id:'0'+i+j+k,
                        arrangeList:arrangeList,
                        seatNum:resdata.classRoomQuery.seat[random_int(0,3)],
                    }
                    resdata.classRoomQueryList.push(classRoom);
                }
            }
        }
    }
    
    let classAreaNo=resdata.classRoomQuery.area.indexOf(req.query.classArea);
    if(classAreaNo==-1){
        res.send("错误请求区域");
        return;
    }
    let resList=resdata.classRoomQueryList.slice(classAreaNo*55,(classAreaNo+1)*55);
    if(req.params.page<1 || req.params.page>Math.ceil(resList.length/10)){
        res.send("错误请求页");
        return;
    } 
    
    infoMould.data={
        total:resList.length,
        pageSize:10,
        pageNo:req.params.page,
        totalPage:Math.ceil(resList.length/10),
        classRoomQueryList:resList.slice((req.params.page-1)*10,req.params.page*10)
    }
    res.send(JSON.stringify(infoMould));
})

//获取已预定的教室列表
router.get('/ReserveClassroom',(req,res)=>{
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log(err);
        const storageData=JSON.parse(data);
        infoMould.data=storageData.reserveClassroomList;
        res.send(JSON.stringify(infoMould));
    })
})

//获取可用的预定教室列表
router.post('/UsableClassroom',(req,res)=>{
    let Cidlist=[];
    for(let i=1;i<6;i++){
        let Cid=req.body.area+"0"+i+"0"+random_int(1,9);
        Cidlist.push(Cid);
    }
    infoMould.data={
        month:req.body.month,
        day:req.body.day,
        timeSlot:req.body.timeSlot,
        area:req.body.area,
        Cidlist:Cidlist
    }
    res.send(JSON.stringify(infoMould));
})

//新增教室预定
router.post('/AddReserveClassroom',(req,res)=>{
    let date=new Date();
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log('读入错',err);
        const storageData=JSON.parse(data);
        storageData.reserveClassroomList.push({
                "area":req.body.area,
                "Cid":req.body.Cid,
                "date":date.getFullYear()+"-"+req.body.month+"-"+req.body.day,
                "timeSlot":req.body.timeSlot,
                "arrange":"会议",
                "check":"wait",
                "id":"0"+date.getTime(),
                "remark":req.body.remark,
        })
        fs.writeFile(__dirname+'/storage-data.json',JSON.stringify(storageData),err=>{
            if(err){
                console.log('写入错',err);
                res.send("写入错误");
                return;
            } 
        })
        infoMould.data="true";
        res.send(JSON.stringify(infoMould));
    })
})

//获取预定的详细信息
router.get('/GetReserveDetail/:id',(req,res)=>{
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log('读入错',err);
        const storageData=JSON.parse(data);
        const reserveClassroomList=storageData.reserveClassroomList;
        let index=-1;
        for(i in reserveClassroomList){
            if(reserveClassroomList[i].id==req.params.id) index=i;
        }
        if(index==-1){
            res.send("预约不存在");
            return;
        }
        infoMould.data={
            remark:reserveClassroomList[index].remark,
        }
        res.send(JSON.stringify(infoMould));
    })
})

//删除预定
router.get('/DeleteReserve/:id',(req,res)=>{
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log('读入错',err);
        const storageData=JSON.parse(data);
        const reserveClassroomList=storageData.reserveClassroomList;
        let index=0;
        for(i in reserveClassroomList){
            if(reserveClassroomList[i].id==req.params.id) index=i;
        }
        console.log(`删除id${req.params.id},数组索引:${index},Cid:${reserveClassroomList[index].Cid}`);
        if(index==-1){
            res.send("预约不存在");
            return;
        }
        storageData.reserveClassroomList.splice(index,1);
        fs.writeFile(__dirname+'/storage-data.json',JSON.stringify(storageData),err=>{
            if(err){
                console.log('写入错',err);
                return;
            } 
        })
        infoMould.data="true";
        res.send(JSON.stringify(infoMould));
    })
})

//获取已选课程
router.get('/getSelectCourse',(req,res)=>{
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log(err);
        const storageData=JSON.parse(data);
        let courseList=storageData.courseList;
        let selectedList=[];
        courseList.forEach((item)=>{
            if(item.isSelect)  selectedList.push(item);
        })
        infoMould.data=selectedList;
        res.send(JSON.stringify(infoMould));
    })
})

//获取可选的课程列表
router.get('/getOptionCourse',(req,res)=>{
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log(err);
        const storageData=JSON.parse(data);
        let courseList=storageData.courseList;
        infoMould.data=courseList.filter(item=>!item.isNecess);
        res.send(JSON.stringify(infoMould));
    })
})

//选择或取消选择课程
router.get('/selectOrCancelCourse',(req,res)=>{
    let courseName=req.query.courseName;
    fs.readFile(__dirname+'/storage-data.json',(err,data)=>{
        if(err) return console.log(err);
        const storageData=JSON.parse(data);
        let courseList=storageData.courseList;
        if(req.query.action=="select"){
            courseList.forEach(item=>{
                if(item.courseName==courseName) item.isSelect=true;
            })
        }
        if(req.query.action=="cancel"){
            courseList.forEach(item=>{
                if(item.courseName==courseName) item.isSelect=false;
            })
        }
        fs.writeFile(__dirname+'/storage-data.json',JSON.stringify(storageData),err=>{
            if(err){
                console.log('写入错',err);
                return;
            }
            else{
                infoMould.data="true";
                res.send(JSON.stringify(infoMould));
            }
        })
    })
})

//获取课程学生列表
router.get('/CourseStudentList',(req,res)=>{
    let courseStudentList=[];
    let courseStudent=resdata.courseStudent;
    for(let i=0;i<54;i++){
        let student={
            studentId:'2017'+random_int(10,30)+random_int(10,30)+random_int(100,900),
            name:courseStudent.lastName[random_int(0,11)]+courseStudent.name1[random_int(0,9)]+(random_int(0,9)>1?courseStudent.name2[random_int(0,9)]:''),
            college:courseStudent.college[random_int(0,3)],
            class:random_int(1,6),
        }
        courseStudentList.push(student);
    }
    infoMould.data=courseStudentList;
    res.send(JSON.stringify(infoMould));
})

//获取教学安排
router.get('/teachSchedule',(req,res)=>{
    if(req.query.selMode=='week'){
        let week=req.query.modeParam*1;
        const resultList=[];
        resdata.teachScheduleList.forEach((item)=>{
            if(item.arrange[week-1].length>0){
                resultList.push({
                    course:item.course,
                    className:item.className,
                    area:item.area,
                    Cid:item.Cid,
                    weekArrange:item.arrange[week-1],
                })
            }
        })
        infoMould.data=resultList;
        res.send(JSON.stringify(infoMould));
        return;
    }
    if(req.query.selMode=='course'){
        let course=req.query.modeParam;
        resdata.teachScheduleList.forEach((item)=>{
            if(item.course==course){
                infoMould.data=item;
                return;
            }
        })
        res.send(JSON.stringify(infoMould));
        return;
    }
})

//获取首页个人消息
router.get('/myInform/:num',(req,res)=>{
    let infoList=[];
    let myInform=resdata.myInform;
    let num=req.params.num*1;
    for(let i=0;i<num;i++){
        infoList.push({
            infoType:myInform.infoType[random_int(0,4)],
            info:myInform.infoList[random_int(0,6)],
            date:(date.getMonth()+1)+"-"+(date.getDate()),
            id:i,
        })
    }
    infoMould.data=infoList;
    res.send(JSON.stringify(infoMould));
})

//获取首页公告
router.get('/getNotice/:num',(req,res)=>{
    let noticeList=[];
    let notice=resdata.notice;
    let num=req.params.num*1;
    for(let i=0;i<num;i++){
        noticeList.push({
            infoType:notice.infoType[random_int(0,4)],
            info:notice.infoList[random_int(0,6)],
            date:(date.getMonth()+1)+"-"+(date.getDate()),
            id:i,
        })
    }
    infoMould.data=noticeList;
    res.send(JSON.stringify(infoMould));
})

////获取首页个人安排
router.get('/getMyArrange/:num',(req,res)=>{
    let arrangeList=[];
    let myArrange=resdata.myArrange;
    let num=req.params.num*1;
    for(let i=0;i<num;i++){
        let textType=random_int(0,2);
        arrangeList.push({
            text:myArrange.text1[textType]+myArrange.text2[textType][random_int(0,3)],
            area:textType!=2 ? myArrange.area[random_int(0,3)]+random_int(1,6)+"0"+random_int(1,9) : '行政楼B1',
            date:(date.getMonth()+1)+"-"+(date.getDate()),
            id:i,
        })
    }
    infoMould.data=arrangeList;
    res.send(JSON.stringify(infoMould));
})

//获取课程表
router.get('/getTimetable',(req,res)=>{
    if(resdata.timetableList.length==0){
        let timetable=resdata.timetable;
        let timetableList=resdata.timetableList;
        for(let course of timetable.course){
            timetableList.push({
                course:course,
                weekArrangeList:[]
            })
        }
        let days=[1,2,2,3,3,4,5];
        let dayi=0;
        let weekendSite=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
        let slotLimit=[[1,4],[1,4],[7,13],[1,4],[7,13],[7,10],[11,13]];
        for(let item of timetableList){
            let startDate=new Date(2022,7,28);
            let lastDay=0;
            let weeklen=random_int(0,5)>=2?12:16;
            let teacher=timetable.firstName[random_int(0,8)]+timetable.lastName[random_int(0,8)];
            for(let i=0;i<weeklen;i++){
                let day=days[dayi];
                if(random_int(0,12)>10){
                    let temp=random_int(0,1);
                    if(weekendSite[i][temp]==0){
                        day=6+temp;
                        weekendSite[i][temp]=1;
                    }
                }
                startDate.setDate(startDate.getDate()+7+day-lastDay);
                lastDay=day;
                let timeslot=[];
                let slotLen=random_int(2,4);
                if(slotLen>slotLimit[dayi][1]-slotLimit[dayi][0]+1) slotLen=slotLimit[dayi][1]-slotLimit[dayi][0]+1;
                let slotStart=random_int(slotLimit[dayi][0],slotLimit[dayi][1]-slotLen+1);
                for(let j=0;j<slotLen;j++){
                    timeslot.push(slotStart+j);
                }
                item.weekArrangeList.push({
                    week:i+1,
                    day:day,
                    date:formalDate(startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate()),
                    teacher:teacher,
                    area:timetable.area[random_int(0,3)],
                    Cid:random_int(1,6)+"0"+random_int(1,9),
                    timeslot:timeslot,
                })
            }
            dayi+=1;
        }
    }

    if(req.query.selMode=="week"){
        let week=req.query.selParam*1-1;
        let courseList=[];
        for(let item of resdata.timetableList){
            if(item.weekArrangeList[week]){
                courseList.push({
                    course:item.course,
                    arrange:item.weekArrangeList[week],
                })
            }
        }
        infoMould.data=courseList;
        res.send(JSON.stringify(infoMould));
    }

    if(req.query.selMode=="course"){
        let course=req.query.selParam;
        infoMould.data=resdata.timetableList.filter((item)=>{
            return item.course==course;
        })
        res.send(JSON.stringify(infoMould));
    }
})

module.exports = router;