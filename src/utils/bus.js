//模拟全局事件总线
class Bus {
    constructor() {
        this.eventList = {}; // 事件列表
    }

    // 订阅
    $on(name, fn) {
        this.eventList[name] = this.eventList[name] || [];
        this.eventList[name].push(fn);
    }

    // 发布
    $emit(name, data) {
        if (this.eventList[name]) {
            this.eventList[name].forEach(fn => {
                fn(data);
            });
        }
    }

    // 取消订阅
    $off(name) {
        if (this.eventList[name]) {
            delete this.eventList[name];
        }
    }
}

export default new Bus();
