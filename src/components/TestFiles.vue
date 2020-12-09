<template>
    <div class="main">
        <h1 class="form-row justify-content-center">Файлы</h1>
        <form class="container col-11" id="form">
            <div class="form-row justify-content-center">
                <div class="form-group">
                    <input type="file" name="avatar" class="file" multiple>
                    <button type="submit" class="btn btn-primary" @click="send()">Сохранить</button>
                </div>
            </div>
            <div class="img justify-content-center">
                <div v-if="files.length == 0">
                    <div class="justify-content-center h2">Загрузка файлов</div>
                    <div style="text-align: center;"><i class='fa fa-spinner fa-pulse fa-3x'></i></div>
                </div>
                <div v-for="item in files" :key="item.data">
                    <div class="form-group text-center my-sm-2" style="padding-left: 5px;">
                        <img v-if="item.contentType.lastIndexOf('image') != -1" :src="item.data" class="col-7" >
                        <video v-if="item.contentType.lastIndexOf('video') != -1" controls class="col-7">
                            <source :src="item.data" :type="item.contentType">
                        </video>
                        <audio v-if="item.contentType.lastIndexOf('audio') != -1" controls>
                            <source :src="item.data" :type="item.contentType">
                        </audio>
                        <a download="Работа Васи Петрова" :href="item.data" :type="item.contentType">Download</a>
                        <!-- <a :href="item.data">show</a> -->
                        <!-- <embed width="600px" :src="item.data" :type="item.contentType"> -->
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
// import toPdf from 'office-to-pdf' 
export default {
    name: 'FilesStore',
    data(){
        return{
            files: [],
            email: this.$store.state.user_id,
            num: 0,
        }
    },
    beforeMount(){
        if(this.email != ''){
            fetch(this.$store.state.serverIp+'/file', {
                method: 'POST',
                headers: {email: this.email}
            })
            .then(response => {
                console.log("res", response)
                this.files = []
                return response.json()
            })
            let socket = this.$store.state.socket
            let numOfUploadedFiles = 0
            socket.on('send_file', (data) => {
                // var win = window.open();
                
                // win.document.write('<iframe src="' + base64.base64Decode(data.file.data, 'PdfFileNameToWrite') + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                // var iframe = "<iframe width='100%' height='100%' src='" + data.file.data + "'></iframe>"
                // var x = window.open();
                // x.document.open();
                // x.document.write(iframe);
                // x.document.close();
                console.log(data)

                    this.files.push({contentType: data.file.contentType, data: data.file.data})
                
            })
            socket.on('add_system_files', () => {
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
                if(file.type.lastIndexOf('image') != -1 || file.type.lastIndexOf('audio') != -1 || file.type.lastIndexOf('video') != -1 || file.type == "application/pdf") reader.readAsDataURL(file)
                else reader.readAsArrayBuffer(file);
                let email = this.email
                // this.$http.post(url + '/uploadFile', data, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // })
                // fetch(url+'/uploadFile', {
                //     method: 'POST',
                //     body: {file: file, email: email},
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                // })
                reader.onload = function () {
                    let type = file.type;
                    if(type.lastIndexOf('image') != -1 || type.lastIndexOf('audio') != -1 || type.lastIndexOf('video') != -1 || type == "application/pdf") data.push({file: reader.result, type: type})
                    else if(type.lastIndexOf('application') != -1){
                        if(type.lastIndexOf('vnd') != -1 && type != 'application/vnd.mozilla.xul+xml' && type != 'application/vnd.google-earth.kml+xml') data.push({file: Buffer.from(new Uint8Array(reader.result)), type: type})
                        else if(type == 'application/pdf' || type == 'application/ogg' || type == 'application/msword') data.push({file: Buffer.from(new Uint8Array(reader.result)), type: type})
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Ошибка',
                                showConfirmButton: false,
                                text: 'Данный тип файлов не поддерживается',
                                timer: 2000
                            })
                        }
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Ошибка',
                            showConfirmButton: false,
                            text: 'Данный тип файлов не поддерживается',
                            timer: 2000
                        })
                    }
                    
                    if(i == len - 1){
                        console.log(data[0].file.length)
                        needle.post(url + '/uploadFile', {file: data, email: email}, {"json": true}, function(err, res){
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
                            
                                var win = window.open();

                                win.document.write('<iframe src="' + res.body.file + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
                            
                    
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