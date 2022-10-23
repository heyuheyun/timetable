<template>
    <div class="container">
        <ul>
            <li class="prebt" :class="{ unclick: current_page_ == 1 }" @click="pre_page">
                <a>&lt;上一页</a>
            </li>
            <li v-show="page1_shwo" @click="page_jump(1)">
                <a>1</a>
            </li>
            <li class="omit" v-show="pre_omit_show">...</li>

            <span v-if="qre_for">
                <li v-for="i in qre_for" @click="page_jump(start_page + i - 1)" :key="i+'q'">
                    <a>{{ start_page + i - 1 }}</a>
                </li>
            </span>
            <li class="active">
                <a>{{ current_page_ }}</a>
            </li>
            <span v-if="lat_for">
                <li v-for="i in lat_for" @click="page_jump(current_page_ + i)"  :key="i+'l'">
                    <a>{{ current_page_ + i }}</a>
                </li>
            </span>

            <li class="omit" v-show="next_omit_show">...</li>
            <li v-show="lastpage_show" @click="page_jump(totel_page)">
                <a>{{ totel_page }}</a>
            </li>
            <li class="nextbt" :class="{ unclick: current_page_ == totel_page }" @click="next_page">
                <a>下一页&gt;</a>
            </li>
        </ul>
        <div class="skipdiv">
            <span>共{{ totel_page }}页,到第<input type="number" value="2" min="1" :max="totel_page" ref="page_input" />页</span>
            <a @click="page_jump(parseInt($refs.page_input.value))">确定</a>
        </div>
    </div>
</template>

<script>
/*
    此组件在初学vue2时封装，故使用vue2写法。
    params{
        current_page: 当前页
        totel_page: 总页数
        continues: 显示的连续页码数，一般为3、5、7
        change_page: 页面改变后的回调函数
    }
*/
export default {
    data() {
        return {
            page1_shwo: false,
            lastpage_show: true,
            pre_omit_show: false,
            next_omit_show: true,

            current_page_: 2,

            start_page: 1,
            end_page: 5,
            qre_for: 1,
            lat_for: 1,
        };
    },
    methods: {
        uppage() {
            let half = Math.trunc(this.continues / 2);

            //更新开始页和结束页
            if (this.current_page_ + half > this.totel_page) this.end_page = this.totel_page;
            else this.end_page = this.current_page_ + half;
            if (this.end_page - half * 2 < 1) this.start_page = 1;
            else this.start_page = this.end_page - half * 2;

            //判断第一页和省略号是否显示
            if (this.start_page > 1) this.page1_shwo = true;
            else this.page1_shwo = false;
            if (this.start_page > 2) this.pre_omit_show = true;
            else this.pre_omit_show = false;

            //判断最后一页和省略号是否显示
            if (this.end_page < this.totel_page) this.lastpage_show = true;
            else this.lastpage_show = false;
            if (this.end_page < this.totel_page - 1) this.next_omit_show = true;
            else this.next_omit_show = false;

            this.qre_for = this.current_page_ - this.start_page;
            this.lat_for = this.end_page - this.current_page_;
        },

        pre_page() {
            if (this.current_page_ != 1) {
                this.current_page_ -= 1;
                this.uppage();
                this.change_page(this.current_page_);
            }
        },
        next_page() {
            if (this.current_page_ != this.totel_page) {
                this.current_page_ += 1;
                this.uppage();
                this.change_page(this.current_page_);
            }
        },
        page_jump(index) {
            this.current_page_ = index;
            this.uppage();
            this.change_page(this.current_page_);
        },
    },
    watch: {
        current_page() {
            this.uppage();
        },
    },
    props: {
        current_page: {
            type: Number,
            default: 1,
        },
        totel_page: {
            type: Number,
            default: 9,
        },
        continues: {
            type: Number,
            default: 5,
        },
        change_page: Function,
    },
    mounted() {
        this.current_page_ = this.current_page;
        this.uppage();
    },
};
</script>

<style scoped lang="less">
.container {
    display: inline-block;
    padding: 10px;
}
.container ul {
    padding: 0;
    display: inline-block;
    list-style-type: none;
    font-size: 0;
}

.container ul li {
    display: inline-block;
    border: 1px solid rgb(219, 219, 219);
    font-size: 14px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
}
.container ul li:hover {
    border: 1px solid @theme-main-color1;
}
.container ul li.active {
    background-color: @theme-main-color1;
    color: white;
}
.container ul li.prebt {
    width: 80px;
    margin-right: 10px;
}
.container ul li.nextbt {
    width: 80px;
    margin-left: 10px;
}
.container ul li.unclick {
    border: 1px solid rgb(219, 219, 219);
    color: rgb(159, 159, 159);
}
.container ul li.omit {
    width: 20px;
    border: 0;
}
.container ul li a {
    vertical-align: middle;
}

.container .skipdiv {
    display: inline-block;
    margin-left: 10px;
    height: 40px;
    font-size: 14px;
}
.container .skipdiv span {
    color: grey;
}
.container .skipdiv span input {
    width: 35px;
    color: grey;
    border: 1px solid rgb(212, 212, 212);
}
.container .skipdiv a {
    margin-left: 10px;
    padding: 5px 10px;
    border: 1px solid rgb(212, 212, 212);
    cursor: pointer;
}
.container .skipdiv a:hover {
    border: 1px solid @theme-main-color1;
    color: @theme-main-color1;
}
</style>
