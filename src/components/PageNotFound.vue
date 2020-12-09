<template>
    <div class="main text-center">
        <img src="./../assets/404.jpg" alt="">
        <!-- Обычный текст<br>
        <b>Жирный текст</b><br>
        <i>Курсивный текст</i><br>
        <strike>Зачеркнутый текст</strike> -->
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',
}
</script>

<style scoped>
.main{
    margin-left: 18%;
    margin-right: 18%;
    min-height: 100%;
    margin-top: 70px;
}
img{
    height: 90vh;
}
@media screen and (max-width: 337px) {
    .main{
        margin-top: 130px;
    }  
}
@media screen and (max-width: 1000px) {
    img{
        height: 401px;
        width: 576px;
    }  
}
@media screen and (max-width: 900px) {
    img{
        height: 360px;
        width: 512px;
    }  
}
@media screen and (max-width: 800px) {
    img{
        height: 337px;
        width: 480px;
    }  
}
@media screen and (max-width: 590px) {
    img{
        height: 278px;
        width: 400px;
    }  
}
@media screen and (max-width: 520px) {
    img{
        height: 222px;
        width: 320px;
    }  
}
@media screen and (max-width: 335px) {
    img{
        height: 167px;
        width: 240px;
    }  
}
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>