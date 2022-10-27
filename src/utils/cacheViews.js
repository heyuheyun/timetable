import { useUserStore } from "@/store";

const arrMethods = Object.create(Array.prototype);
const cacheViewList = Object.create(arrMethods);
const keepAliveName = [];       //要缓存的组件名称数组
const addFn = ["push", "unshift"];
const delFn = ["pop", "shift"];

//改写cacheViewList数组的push和unshift方法
addFn.forEach(method => {
    arrMethods[method] = function (...args) {
        for (let item of args) {
            if (Object.prototype.toString.call(item) === "[object Object]") {
                if (item.meta.cache && item.name) {
                    if (!keepAliveName.includes(item.name)) keepAliveName.push(item.name);
                }
            }
        }
        return Array.prototype[method].apply(this, args);
    };
});

//改写cacheViewList数组的pop和shift方法
delFn.forEach(method => {
    arrMethods[method] = function () {
        let item = method === "pop" ? this[this.length - 1] : this[0];
        if (Object.prototype.toString.call(item) === "[object Object]") {
            if (item.meta.cache && item.name) {
                if (keepAliveName.includes(item.name)) keepAliveName.splice(keepAliveName.indexOf(item.name), 1);
            }
        }
        return Array.prototype[method].apply(this);
    };
});

//改写cacheViewList数组的splice方法
arrMethods.splice = function (index, howmany, ...items) {
    index = parseInt(index);
    howmany = howmany === undefined ? this.length : parseInt(howmany);
    if (!isNaN(howmany) && howmany > 0) {
        for (let i = 0; i < howmany && i + index < this.length; i++) {
            let item = this[index + i];
            if (Object.prototype.toString.call(item) === "[object Object]") {
                if (item.meta.cache && item.name) {
                    if (keepAliveName.includes(item.name)) keepAliveName.splice(keepAliveName.indexOf(item.name), 1);
                }
            }
        }
    }
    if (items.length > 0) {
        items.forEach(item => {
            if (Object.prototype.toString.call(item) === "[object Object]") {
                if (item.meta.cache && item.name) {
                    if (!keepAliveName.includes(item.name)) keepAliveName.push(item.name);
                }
            }
        });
    }
    return Array.prototype.splice.call(this, index, howmany, ...items);
};

//初始化缓存数组
function initCache() {
    const userStore = useUserStore();
    cacheViewList.splice(0);
    keepAliveName.splice(0);
    let checkRoutes = routes => {
        for (let item of routes) {
            if (item.children && item.children.length > 0) checkRoutes(item.children);
            else {
                if (item.meta.fixCache)
                    cacheViewList.push({
                        name: item.name,
                        path: item.path,
                        meta: JSON.parse(JSON.stringify(item.meta)),
                    });
            }
        }
    };
    checkRoutes(userStore.userRoutes);
    for (let item of cacheViewList) {
        if (item.name) keepAliveName.push(item.name);
    }
}

export { cacheViewList, keepAliveName, initCache };
