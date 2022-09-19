<template>
    <div class="page-wrap">
        <div class="show-area">
            <div class="err-pic">
                <img src="@/assets/imgs/401.png" />
            </div>
            <div class="message-area">
                <p class="oops">Error 401...</p>
                <p class="copyright">图片出自 《Where the Wild Things Are》</p>
                <p class="headline">抱歉，您不能访问当前页面</p>
                <p class="detail">请检查您输入的url是否正确，如需帮助可联系网站管理员</p>
                <p class="detail">或点击下面按钮返回主页</p>
                <button @click="router.push('/')">返回主页</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style lang="less" scoped>
.page-wrap {
    width: 100%;
    height: 100vh;
    background-color: white;
    position: relative;

    .show-area {
        position: absolute;
        width: 80%;
        height: 70%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .err-pic {
            width: 50%;
            height: 100%;

            img {
                height: 100%;
            }
        }

        .message-area {
            position: absolute;
            left: 60%;
            top: 10%;

            .oops {
                font-size: 38px;
                color: rgb(0, 122, 135);
                margin: 24px 0px;
            }
            .copyright {
                color: rgb(179, 179, 179);
                font-size: 14px;
                margin: 24px 0px;
            }
            .headline {
                font-size: 22px;
                font-weight: bold;
                color: black;
                margin: 16px 0px;
            }
            .detail {
                font-size: 16px;
                color: rgb(109, 109, 109);
                margin: 6px 0px;
            }
            button {
                background-color: rgb(0, 122, 135);
                margin: 16px 0px;
                padding: 8px 16px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                border-radius: 5px;
                border: 0;
                &:hover {
                    background-color: rgb(104, 159, 165);
                }
            }
        }
    }
}
</style>
