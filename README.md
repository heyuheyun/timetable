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
