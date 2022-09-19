import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

/*
路由说明：
    新增的路由可挂载到路由'/'的子路由下，也可直接新增路由项。
    带有子路由的路由项默认在侧边栏菜单呈现嵌套结构，支持多重路由嵌套。
    name：应该与路由对应的组件名称一致，否则KeepAlive无法正常工作
    meta{
        title:侧边栏菜单名
        icon：显示在侧边栏的图标（本项目使用阿里图标库的css图标）
        limit：权限控制，列表项为能访问到当前路由的角色，与当前角色权限不符的路由不会显示在侧边栏菜单
        fixCache：是否固定缓存该路由对应的组件，选择此项的路由同时会固定在tagViews不可删除
        cache：是否缓存该路由对应的组件，可在tagViews中清除
        isLink：表明该路由对应外链
        hideInMenu:决定当前路由是否在侧边栏菜单隐藏
    }
*/ 

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue'),
        meta:{ hideInMenu:true }
    },
    {
        path: '/',
        component: Layout,
        redirect:'/homepage',
        meta:{ hideInMenu:true },
        children:[
            {
                path:'homepage',
                name:'Homepage',
                component : () => import( '@/views/userpages/HomePage.vue' ),
                meta:{ title:'首页' , icon:"icon-shouye" , limit:["admin","teacher","student"] , fixCache:true }
            },
            {
                path:'userinfo',
                name:'userinfoMenu',
                redirect:'/userinfo/account',
                meta:{ title:'用户信息' , icon:"icon-user-circle" , limit:["admin","teacher","student"] },
                children:[
                    {
                        path:'account',
                        name:'UserInfo',
                        component : () => import( '@/views/userpages/UserInfo.vue' ),
                        meta:{ title:'账号信息' , icon:"" , limit:["admin","teacher","student"] },
                    },
                    {
                        path:'login-history',
                        name:'LogHistory',
                        component : () => import( '@/views/userpages/LogHistory.vue' ),
                        meta:{ title:'登录历史' , icon:"" , limit:["admin","teacher","student"] , cache:true },
                    },
                ]
            },
            {
                path:'classroom',
                name:'classroomMenu',
                redirect:'/classroom/classroom-query',
                meta:{ title:'教室' , icon:"icon-jiaoshi" , limit:["admin","teacher","student"] },
                children:[
                    {
                        path:'classroom-query',
                        name:'Classroom',
                        component : () => import( '@/views/userpages/ClassRoom.vue' ),
                        meta:{ title:'教室查询' , icon:"" , limit:["admin","teacher","student"] , cache:true },
                    },
                    {
                        path:'arrange-classroom',
                        name:'ArrangeClassroom',
                        component : () => import( '@/views/userpages/ArrangeClassroom.vue' ),
                        meta:{ title:'预约教室' , icon:"" , limit:["admin","teacher","student"] },
                    },
                ]
            },
            {
                path:'course-select',
                name:'course-select',
                redirect:'/course-select/selected-course',
                meta:{ title:'课程选择' , icon:"icon-kechengguanli" , limit:["student"] },
                children:[
                    {
                        path:'selected-course',
                        name:'SelectedCourse',
                        component : () => import( '@/views/userpages/student/SelectedCourse.vue' ),
                        meta:{ title:'已选课程' , icon:"" , limit:["student"] },
                    },
                    {
                        path:'select-course',
                        name:'SelectCourse',
                        component : () => import( '@/views/userpages/student/SelectCourse.vue' ),
                        meta:{ title:'选择课程' , icon:"" , limit:["student"] },
                    },
                ]
            },
            {
                path:'timetable',
                name:'UserTimeTable',
                component : () => import( '@/views/userpages/student/UserTimeTable.vue' ),
                meta:{ title:'课程表' , icon:"icon-calendar-alt" , limit:["student"] , cache:true }
            },
            {
                path:'studentinfo',
                name:'StudentInfo',
                component : () => import( '@/views/userpages/teacher/StudentInfo.vue' ),
                meta:{ title:'学生信息' , icon:"icon-xuesheng" , limit:["teacher"] , cache:true }
            },
            {
                path:'teching',
                name:'Teching',
                component : () => import( '@/views/userpages/teacher/Teaching.vue' ),
                meta:{ title:'教学安排' , icon:"icon-calendar-alt" , limit:["teacher"] , cache:true }
            },
        ]
    },
    {
        path: '/menu',
        name: 'menu',
        redirect:'/menu/menu1',
        component: Layout,
        meta:{ title:'menu' , icon:"icon-caidan" , limit:["admin"] },
        children:[
            {
                path:'menu1',
                name:'submenu1',
                component : () => import( '@/views/userpages/submenu_dome/submenu1' ),
                meta:{ title:'menu1' , icon:"icon-caidan" , limit:["admin"] },
                children:[
                    {
                        path:'menu1-1',
                        name:'submenu1-1',
                        component : () => import( '@/views/userpages/submenu_dome/submenu1-1' ),
                        meta:{ title:'menu1-1' , icon:"icon-caidan" , limit:["admin"] },
                    },
                    {
                        path:'menu1-2',
                        name:'submenu1-2',
                        component : () => import( '@/views/userpages/submenu_dome/submenu1-2' ),
                        meta:{ title:'menu1-2' , icon:"icon-caidan" , limit:["admin"] },
                    },
                ]
            },
            {
                path:'menu2',
                name:'submenu2',
                component : () => import( '@/views/userpages/submenu_dome/submenu2' ),
                meta:{ title:'menu2' , icon:"icon-caidan" , limit:["admin"] },
            },
        ]
    },
    {
        path:"/external-link",
        component: Layout,
        meta:{title:'外链' , icon:"icon-lianjie" , isLink:true , limit:["admin"]},
        children:[
            {
                path:"https://cn.vuejs.org/",
                meta:{title:'Vue' , icon:"" , isLink:true},
            },
            {
                path:"https://github.com/",
                meta:{title:'Github' , icon:"" , isLink:true},
            },
        ]
    },
    {
        path:"/error",
        component: Layout,
        meta:{title:'错误页面' , icon:"icon-caidan",limit:["admin"]},
        children:[
            {
                path:"404",
                name:"404",
                component : () => import( '@/views/error/404.vue' ),
                meta:{title:'404' , icon:"",limit:["admin"]},
            },
            {
                path:"401",
                name:"401",
                component : () => import( '@/views/error/401.vue' ),
                meta:{title:'401' , icon:"",limit:["admin"]},
            },
        ]
    },
    {
        path:"/404",
        component : () => import( '@/views/error/404.vue' ),
        meta:{ hideInMenu:true },
    },
    {
        path:"/401",
        component : () => import( '@/views/error/401.vue' ),
        meta:{ hideInMenu:true },
    },
    {
        path:"/:pathMatch(.*)*",
        redirect:"/404",
        meta:{ hideInMenu:true },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router