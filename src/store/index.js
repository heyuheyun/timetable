import { defineStore } from 'pinia'
import { getToken,setToken } from '@/utils/token'
import { useRouter } from 'vue-router'
import {reUserInfo} from '@/api/common.js'

//存储用户的身份信息与拥有权限的路由
export const useUserStore=defineStore("user",{
    state:()=>{
        return {
            token:getToken(),
            role:"visitor",
            userName:"visitor",
            phone:null,
            isLogin:false,
            userRoutes:[],
        }
    },
    actions:{
        async  updataUserInfo(){
            let info=await reUserInfo();
            if(info.code==200){
                this.role=info.data.role;
                this.userName=info.data.userName;
                this.phone=info.data.phone;
                this.isLogin=info.data.isLogin;
                return true;
            }
            else return false;
        },

        resetUserInfo(){
            this.role="visitor";
            this.userName="visitor";
            this.phone=null;
            this.isLogin=false;
        },

        updataToken(token){
            setToken(token);
            this.token=token;
        },

        getUserRoutes(){
            const router = useRouter();
            const routes=router.getRoutes();
            let showMenu=[];
            routes.forEach(item => {
                if(!item.meta.hideInMenu&&item.path.match(/\//g).length==1)
                    if( !item.meta.limit || item.meta.limit.indexOf(this.role)!=-1)
                        showMenu.push(item);
            });
            this.userRoutes=showMenu;
        }
    }
})

//项目设置
export const useSetStore=defineStore("set",{
    state:()=>{
        return {
            siderbarThumbnail:false,
            setShow:false,
            siderLogoShow:true,
            tagViewsShow:true,
            fixNavbar:true,
        }
    },
})

//当前缓存的路由项
export const useCacheViews=defineStore("cacheViews",{
    state:()=>{
        return {
            cacheViewList:[],
            keepAliveName:[],
        }
    },
    actions:{
        initCache(){
            this.cacheViewList=[];
            this.keepAliveName=[];
            const userStore = useUserStore();
            let checkRoutes=(routes)=>{
                for(let item of routes){
                    if(item.children && item.children.length>0)    checkRoutes(item.children);
                    else {
                        if(item.meta.fixCache)  this.cacheViewList.push(item);
                    }
                }
            }
            checkRoutes(userStore.userRoutes);
            for(let item of this.cacheViewList){
                if(item.name) this.keepAliveName.push(item.name);
            }
        }
    }
})
