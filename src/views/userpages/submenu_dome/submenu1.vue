<template>
    <div class="dv1">submenu1
        <div class="dv2">
        <router-view></router-view>
    </div>
    </div>
    
</template>

<script>
export default {};
</script>

<style scoped>
.dv1{
    width:100%;
    height:100%;
    background-color: rgb(199, 199, 199);
    position: relative;
}
.dv2{
    width:50%;
    height:50%;
    background-color: rgb(148, 148, 148);
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}

</style>