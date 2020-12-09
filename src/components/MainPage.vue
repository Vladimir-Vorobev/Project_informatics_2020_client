<template>
    <div class="main">
        <h1 class="h3 text-center">WELCOME<br><div class="h5">TO THE FIRST WEBSITE WHERE<br>YOU CAN PRACTIZE ENGLISH LANGUAGE WRITTEN SPEECH</div></h1>
        <div class="text-center"><small>(For children and teenagers under 18 only!)</small></div>
        <div class="h4">You can:</div>
        <ol>
            <li>WRITE PRIVATE MESSAGES TO PEOPLE FROM DIFFERENT PARTS OF THE COUNTRY</li>
            <li>MAKE FRIENDS WITH NATIVE SPEAKERS</li>
            <li>CHAT WITH PEERS EVERYTIME WHEN YOU ARE ONLINE</li>
            <li>TRY OUR ENGLISH GRAMMAR AND VOCABULARY TEST TO CHECK YOUR LEVEL (under development)</li>
            <li>GET ACCESS TO THE STUDYING MATERIALS SUCH AS VIDEOS, PICTURES, TESTS, GAMES ETC. (under development)</li>
            <li>PREPARE TO THE OLYMPIADS WITH SPECIAL MATERIALS FROM OUR EXPERIENCED STUDENTS (under development)</li>
        </ol>
        <div class="h5 text-center">WAIT NO MORE! LOG IN AND NEVER BE SHY TO WRITE THE FIRST! =)</div>
    </div>
</template>

<script>
export default {
    name: 'MainPage',
}
</script>

<style scoped>
.main{
    margin-left: 18%;
    margin-right: 18%;
    padding-right: 50px;
    padding-left: 50px;
    min-height: 100%;
    margin-top: 70px;
}

@media screen and (max-width: 337px) {
    .main{
        margin-top: 130px;
    }  
}
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>