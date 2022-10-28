import router from "./router";
import { useUserStore } from "@/store";
//加载进度条
import NProgress from "@/utils/nprogress";

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    NProgress.start();
    document.title = to.meta.title ? to.meta.title + " - " + "Vue Timetable" : "Vue Timetable";
    if (!userStore.isLogin) {
        if (to.path === "/login") {
            next();
            NProgress.done();
        } else {
            if (userStore.token) {
                let result = await userStore.updataUserInfo();
                if (result) {
                    if (to.meta.limit && to.meta.limit.indexOf(userStore.role) === -1) next("/401");
                    else {
                        next();
                        NProgress.done();
                    }
                } else next("/login");
            } else next("/login");
        }
    } else {
        if (to.meta.limit && to.meta.limit.indexOf(userStore.role) === -1) {
            next("/401");
        } else {
            next();
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
