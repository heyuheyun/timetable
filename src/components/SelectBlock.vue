<template>
    <div class="select-wrap">
        <span class="atr">{{ atr }}</span>
        <span class="select" tabindex="-1" @click="showSelect(true)" @blur="showSelect(false)">
            <span v-show="!modelValue">
                {{ describe }}
            </span>
            <span v-show="modelValue">{{ showValue }}</span>

            <ul class="option" ref="option">
                <slot>
                    <div class="nodata">No Data</div>
                </slot>
            </ul>

            <i class="iconfont icon icon-unfold" ref="foldIcon"></i>
        </span>
    </div>
</template>

<script setup>
/*
    params{
        modelValue: 组件绑定的值
        atr: 属性名
        describe: 属性描述
        change: 组件的值改变时触发的回调函数
    }
    插槽内<li>标签的自定义属性svalue：若存在则组件绑定的值为svalue，否则绑定值为<li>标签的innerHLML
*/
import { ref, onMounted } from "vue";

const option = ref();
const foldIcon = ref();

const props = defineProps({
    modelValue: [String, Number],
    atr: String,
    describe: String,
    change: Function,
});
const emit = defineEmits(["update:modelValue"]);
const showValue=ref(props.modelValue);

//展开选项
function showSelect(isShow) {
    if (isShow) {
        if (option.value.scrollHeight > 200) {
            if (option.value.style.maxHeight !== "200px") {
                option.value.style.maxHeight = "200px";
                option.value.style.overflow = "auto";
                return;
            }
        } else {
            if (option.value.style.maxHeight !== option.value.scrollHeight + 1 + "px") {
                option.value.style.maxHeight = option.value.scrollHeight + 1 + "px";
                foldIcon.value.className = "iconfont icon icon-packup";
                return;
            }
        }
    }
    option.value.style.maxHeight = "0px";
    option.value.style.overflow = "hidden";
    foldIcon.value.className = "iconfont icon icon-unfold";
}

onMounted(() => {
    //给选项绑定点击事件
    function addClick() {
        const options = option.value.children;
        for (let i = 0; i < options.length; i++) {
            options[i].onmousedown = () => {
                if(options[i].getAttribute('svalue')){
                    //如果有自定义属性svalue，则作为绑定值返回
                    emit("update:modelValue", options[i].getAttribute('svalue'));
                }else{
                    emit("update:modelValue", options[i].innerHTML);
                }
                showValue.value=options[i].innerHTML;
                //如果绑定了选项改变的函数
                if (props.change) props.change(options[i].innerHTML);
            };
        }
    }
    addClick();

    //检测slot内元素的变化
    const observer = new MutationObserver(mutationsList => {
        addClick();
    });
    observer.observe(option.value, {
        childList: true,
    });
});
</script>

<style lang="less" scoped>
.select-wrap {
    display: inline-block;

    .atr {
        font-size: calc(@baseSize * 1.2);
        font-weight: bold;
    }

    .select {
        display: inline-block;
        position: relative;
        margin: 3px 12px 3px 12px;
        width: 156px;
        color: rgb(175, 175, 175);
        outline: 1px solid rgb(216, 216, 216);
        padding: 12px;
        border-radius: 5px;
        cursor: pointer;
        &:focus {
            outline-color: @theme-main-color1;
        }

        .option {
            max-height: 0;
            overflow: hidden;
            position: absolute;
            left: 0%;
            top: 110%;
            width: 100%;
            z-index: 9;
            background-color: rgb(250, 250, 250);
            box-shadow: 0px 0px 10px 2px rgba(184, 184, 184, 0.3);
            border-radius: 5px;
            transition: max-height 0.5s;

            :slotted(li) {
                color: rgb(99, 99, 99);
                padding: 10px 14px;
                cursor: pointer;
                &:hover {
                    background-color: rgb(230, 230, 230);
                }
            }
            .nodata {
                color: rgb(151, 151, 151);
                padding: 12px;
                font-size: calc(@baseSize * 1.2);
                text-align: center;
            }
        }

        i {
            position: absolute;
            right: 5%;
        }
    }
}
</style>
