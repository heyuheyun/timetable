# vue-timetable
- **项目在线预览**：[vue-timetable](http://39.99.234.229:9504/)
## 技术栈
**javascript** + **vue3**  +**pinia** + **vue-router** +  **nodejs** + **webpack**  + **less**
## 简介
此项目是基于vue3搭建的**后台管理/课程表选课系统模板，主要用于学习**。未引入ui库，组件样式使用less实现。目前已实现简单的菜单路由权限验证，可支持多级路由，支持动态换肤等。项目数据使用**nodejs**模拟，大部分数据每次请求随机模拟，部分数据在node重启后方可随机刷新。
路由结构参考[vue-element-admin](https://panjiachen.github.io/vue-element-admin)。

## 特性
- **路由权限验证**
- 动态侧边栏（支持多级路由）
- 菜单搜索
- 动态换肤、更换字体大小
- **nodejs实现数据交互**
- 面包屑导航
- 角色切换

## 项目结构
```
src
├─api			//请求api
├─assets		//静态资源
│  └─imgs			//图片存放
├─components	//公共组件
├─icon 			//图标
├─router		//项目路由
├─store			//pinia仓库
├─style			//公共样式文件、主题控制
├─utils			//工具函数
└─views			//路由页面
    ├─error				//错误页面
    ├─layout			//样式布局控制
    │  └─components				//样式组件
    ├─login				//登录页面
    └─userpages			//用户页面
        ├─student			//学生权限的页面
        ├─submenu_dome		//多级路由菜单演示
        └─teacher			//学生权限的页面
```
  

## 项目使用
**启动**
```
克隆项目
git clone https://github.com/heyuheyun/timetable.git

安装依赖
npm install

运行
npm run dev
```
**其他**
```
项目构建
npm run build

单独运行前端页面（需存在对应的后端接口，否则无法获取数据）
npm run serve

单独启动后端接口（默认后端接口：http://localhost:9508）
npm run node
```
## license
[MIT](https://github.com/heyuheyun/timetable/blob/master/LICENSE)
Copyright (c) 2022-present heyuheyun