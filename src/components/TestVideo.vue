<template>
    <div class="main">
        <h1 class="form-row justify-content-center">Видео</h1>
        <form class="container col-11">
            <div class="form-row justify-content-center">
                <div class="form-group">
                    <input type="file" name="avatar" class="file" accept="video/*" multiple>
                    <button type="submit" class="btn btn-primary" @click="send()">Сохранить</button>
                </div>
            </div>
            <div class="img justify-content-center">
                <div v-if="video.length == 0">
                    <div class="justify-content-center h2">Загрузка видео</div>
                    <div style="text-align: center;"><i class='fa fa-spinner fa-pulse fa-3x'></i></div>
                </div>
                <div v-for="item in video" :key="item.data">
                    <div class="form-group text-center my-sm-2" style="padding-left: 5px;">
                        <video width="600" height="400" controls><source :src="item.data" :type="item.type"></video>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import needle from 'needle'
import anime from 'animejs'
export default {
    name: 'VideoStore',
    data(){
        return{
            video: [],
            email: this.$store.state.user_id,
            num: 0,
        }
    },
    beforeMount(){
        if(this.email != ''){
            fetch(this.$store.state.serverIp+'/video', {
                method: 'POST',
                headers: {email: this.email}
            })
            .then(response => {
                console.log("res", response)
                this.video = []
                return response.json()
            })
            let socket = this.$store.state.socket
            let numOfUploadedFiles = 0
            socket.on('send_video', (data) => {
                this.video.push({contentType: data.video.contentType, data: data.video.data})
            })
            socket.on('add_system_video', () => {
                numOfUploadedFiles += 1
                let pers = document.querySelector('.persents')
                let num = numOfUploadedFiles / this.num * 100
                anime({
                    targets: 'progress',
                    value: num,
                    easing: 'linear'
                });
                anime({
                    targets: pers,
                    innerHTML: num + '%',
                    easing: 'linear',
                    round: 1,
                });
                pers.value = num
                if(numOfUploadedFiles == this.num){
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Видео успешно сохранены',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        setTimeout(() => {
                            window.location.reload()
                        }, 2000);
                    }, 2000);
                }
            })
        }
    },
    methods:{
        send(){
            event.preventDefault()
            let data = []
            let len = document.querySelector('.file').files.length
            let url = this.$store.state.serverIp
            if(len == 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка',
                    showConfirmButton: false,
                    text: 'Файл не выбран',
                    timer: 2000
                })
                setTimeout(() => {
                    return
                }, 2000);
            }
            this.num = len
            Swal.fire({
                icon: 'info',
                title: 'Ваши файлы загружаются',
                showConfirmButton: false,
                html: '<div class="justify-content-center h2 persents" value="0">0%</div>' +
                '<progress class="progress_swal" value="0" max="100"></progress>',
            })
            for(let i = 0; i < len; i++){
                let reader = new FileReader();
                let file = document.querySelector('.file').files[i]
                reader.readAsDataURL(file);
                let email = this.email
                reader.onload = function () {
                    data.push({file: reader.result, type: file.type})
                    if(i == len - 1){
                        needle.post(url + '/uploadVideo', {video: data, email: email}, {"json": true}, function(err, res){
                            if(err){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Ошибка',
                                    showConfirmButton: false,
                                    text: 'Непредвиденная ошибка, повторите попытку',
                                    timer: 2000
                                })
                                console.log(err)
                            }
                            else if(res.body == '310'){
                                document.cookie = "email=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                                document.cookie = "SessionID=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                                document.location.href = '/login'
                            }
                        })
                    }
                }
                reader.onerror = function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ошибка',
                        showConfirmButton: false,
                        text: 'Непредвиденная ошибка, повторите попытку',
                        timer: 2000
                    })
                    console.log('Error: ', error);
                };
            }
        }
    }
}
</script>

<style scoped>
.main{
    padding-right: 50px;
    padding-left: 50px;
    min-height: 100%;
    margin-top: 60px;
}
.img{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>