<template>
    <div class="main justify-content-center">
        <div class="place"><div class="name text-center">{{friend}}</div></div>
        <div class="for_chat">
            <div class="chat col-12 justify-content-center column" v-for="item in chat" :key="item.message" :style="message_status(item.from, item.read_time)">
                <div class="bg-warning col-9 col-sm-7 col-xl-3 time_main text-center" :id='item.num'></div>
                <div v-if="item.from == user_id" class="row col-11" style="margin-left: auto;">
                    <div class="you" style="margin-left: auto;">
                        <div>{{make_normal(emoji.emojify(item.message.data))}}</div>
                        <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                    </div>
                </div>
                <div v-else class="row justify-content-start col-11">
                    <div class="friend">
                        <div>{{make_normal(emoji.emojify(item.message.data))}}</div>
                        <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                    </div>
                </div>
            </div>
        </div>
         <div class="place">
            <div class="message row container-fluid">
                <textarea type="text" class="" style="width: calc(100% - 47px);" id="message" @input="change_width(), check_text('message', 3000)" @keypress.enter="send_message()" placeholder="Enter message"></textarea>
                <button class="send btn btn-info" @click="send_message()"><i class="fas fa-paper-plane"></i></button>
            </div>
         </div>
    </div>
</template>

<script>
import emoji from 'node-emoji'
import Swal from 'sweetalert2'
export default {
    name: 'PrivateChat',
    data(){
        return{
            email: this.$store.getters.email,
            SessionID: this.$store.getters.SessionID,
            user_id: this.$store.state.user_id,
            friend: '',
            users: [],
            chat: [],
            socket: this.$store.state.socket,
            try: true,
            emoji: emoji,
        }
    },
    beforeMount(){
        if(this.email != ''){
            let pathname = window.location.pathname.slice(7)
            if(pathname.slice(0, pathname.length / 2) == this.user_id) this.users = [pathname.slice(0, pathname.length / 2), pathname.slice(pathname.length / 2)]
            else this.users = [pathname.slice(pathname.length / 2), pathname.slice(0, pathname.length / 2)]
            this.get_chat()
            let socket = this.socket
            socket.on('new_message', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    if(this.users.lastIndexOf(data.from) == -1) return
                    this.chat.push(data)
                    let id = this.$store.state.user_id
                    new Promise(function(resolve) {
                        let pageDown = setInterval(() =>{
                            if(document.getElementById(data.num)){
                                let scrollHeight = Math.max(
                                    document.body.scrollHeight, document.documentElement.scrollHeight,
                                    document.body.offsetHeight, document.documentElement.offsetHeight,
                                    document.body.clientHeight, document.documentElement.clientHeight
                                );
                                if(data.from == id) window.scrollTo(0,document.body.scrollHeight)
                                else if(scrollHeight - window.pageYOffset <= 1000) window.scrollTo(0,document.body.scrollHeight)
                                clearInterval(pageDown)
                                resolve()
                            }
                        }, 100)
                    })
                    .then(() => {
                        this.check_message(data)
                        for(let h = 0; h < this.chat.length; h++)this.getInfoTime(this.chat[this.chat.length - 1 - h].send_time, this.chat[this.chat.length - 1 - h].num)  
                    })
                })
            })
            socket.on('read_message', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    let read = setInterval(() =>{
                        for(let i = 0; i < this.chat.length; i++){
                            if(this.chat[i].num == data.num){
                                for(let j = 0; j < 5; j++){
                                    this.chat[i].read_time.push(data.read_time[j])
                                }
                                clearInterval(read)
                            }
                        }
                    }, 200)
                })
            })
            window.onscroll = (() => {
                if (window.pageYOffset == 0) {
                    this.get_chat()
                }
            })
            // socket.on('connection', () => {

            // })
        }
        else document.location.href = '/login'
    },
    methods:{
        getTime(time){
            let now = new Date()
            // let nowYear = now.getFullYear()
            // let nowMonth = now.getMonth()
            // let nowDate = now.getDate()
            // let nowMinutes = now.getMinutes()
            let difference = now.getTimezoneOffset()
            // let monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let send_time = new Date(time[0], time[1], time[2], time[3] - Math.floor(difference / 60), time[4] - difference % 60)
            let houres
            if(send_time.getHours() < 10) houres = '0' + send_time.getHours()
            else houres = send_time.getHours()
            if(send_time.getMinutes() < 10) return houres + ':0' + send_time.getMinutes()
            else return houres + ':' + send_time.getMinutes()
        },
        getInfoTime(time, num){
            let now = new Date()
            let nowYear = now.getFullYear()
            let nowMonth = now.getMonth()
            let nowDate = now.getDate()
            let difference = now.getTimezoneOffset()
            let monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let send_time = new Date(time[0], time[1], time[2], time[3] - Math.floor(difference / 60), time[4] - difference % 60)
            if(nowDate == send_time.getDate() && nowMonth == send_time.getMonth() && nowYear == send_time.getFullYear()){
                if(this.chat.slice(-1)[0].num != num) document.getElementById(num + 1).innerHTML = ''
                document.getElementById(num).innerHTML = 'Today'
            }
            else if(nowDate - 1 == send_time.getDate() && nowMonth == send_time.getMonth() && nowYear == send_time.getFullYear()){
                if(this.chat.slice(-1)[0].num != num){
                    if(document.getElementById(num + 1).innerHTML != 'Today')document.getElementById(num + 1).innerHTML = ''
                }
                document.getElementById(num).innerHTML = 'Yesterday'
            }
            else if(nowYear == send_time.getFullYear()){
                if(this.chat.slice(-1)[0].num != num){
                    if(document.getElementById(num + 1).innerHTML != 'Yesterday' && document.getElementById(num + 1).innerHTML == send_time.getDate() + ' ' + monthes[send_time.getMonth()]) document.getElementById(num + 1).innerHTML = ''
                }
                document.getElementById(num).innerHTML = send_time.getDate() + ' ' + monthes[send_time.getMonth()]
            }
            else{
                if(this.chat.slice(-1)[0].num != num){
                    if(document.getElementById(num + 1).innerHTML != send_time.getDate() + ' ' + monthes[send_time.getMonth()] && document.getElementById(num + 1).innerHTML == send_time.getDate() + ' ' + monthes[send_time.getMonth()] + ' ' + send_time.getFullYear()) document.getElementById(num + 1).innerHTML = ''
                }
                document.getElementById(num).innerHTML = send_time.getDate() + ' ' + monthes[send_time.getMonth()] + ' ' + send_time.getFullYear()
            }
        },
        change_width(){
            event.target.style.height = 'auto'
            event.target.style.height = event.target.scrollHeight + 2 + "px"
            document.querySelector('.for_chat').style.marginBottom = 20 + "px"
            document.querySelector('.for_chat').style.marginBottom = event.target.scrollHeight + "px"
        },
        check_text(elem, size){
            let el = document.getElementById(elem)
            el.value = emoji.emojify(this.$store.state.check_text(emoji.unemojify(el.value), size))
        },
        send_message(){
            let message = document.getElementById('message').value
            let status = setInterval(() =>{
                if(this.$store.state.role != ''){
                    clearInterval(status)
                    if(this.$store.state.ban_time[0] == 'forever'){
                        let reason = this.$store.state.reason
                        let images = this.$store.state.images
                        Swal.fire({
                            title: 'You were banned by administrator', 
                            html:   "You can't write any messages at all" +
                                    '<br>' +
                                    `Reason: ${reason}` +
                                    `<img width="350" height="230" src="${images}" alt="">`,
                        })
                        document.getElementById('message').value = ''
                    }
                    else if(message.trim().length != 0){
                        this.socket.emit('new_message', {email: this.email, sessionid: this.SessionID, users: this.users, message: emoji.unemojify(message), type: 'text', from: this.user_id, for: this.users[1]})
                        document.getElementById('message').value = ''
                    }
                } 
            }, 100)  
        },
        message_status(from, time){
            if(from == this.user_id){
                if(time.length == 0) return 'background-color: lavender;'
            }
        },
        check_message(chat){
            if(chat.from != this.user_id && chat.read_time.length == 0){
                if(window.location.pathname.slice(7) == this.users[0] + this.users[1] || window.location.pathname.slice(7) == this.users[1] + this.users[0]){
                    this.socket.emit('read_message', {email: this.email, sessionid: this.SessionID, user_id: this.user_id, chat: chat})
                }
            }
        },
        get_chat(){
            if(this.try){
                fetch(this.$store.state.serverIp+'/getPrivateChat', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, users: this.users, num: this.chat.length}),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                    console.log("res", response)
                    return response.json()
                })
                .then(data => {
                    if(data == 'UNDEF'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            showConfirmButton: false,
                            text: 'This chat does not exist',
                            timer: 2000
                        })
                        setTimeout(() => {
                            document.location.href = '/chats'
                        }, 2000)
                    }
                    else{
                        if(data[0][0].chat.length == 0 || data[0][0].chat.length < 20){
                            this.try = false
                        }
                        let chat = data[0][0].chat.reverse()
                        let elem
                        if(this.chat.length != 0) elem = document.getElementById(this.chat.slice(0)[0].num)
                        for(let j = 0; j <  chat.length; j++){
                            this.chat.unshift(chat[j])
                        }
                        this.friend = data[1]
                        let inf = this.chat
                        new Promise(function(resolve) {
                            let pageDown = setInterval(() =>{
                                if(document.getElementById(inf.slice(-1)[0].num)){
                                    setTimeout(() => {
                                        if(inf.length <= 20) window.scrollTo(0,document.body.scrollHeight)
                                        else if(data.length != 0) elem.scrollIntoView()
                                        clearInterval(pageDown)
                                        resolve()
                                    }, 150)
                                }
                            }, 100)
                        })
                        .then(() => {
                            for(let h = 0; h < this.chat.length; h++)this.getInfoTime(this.chat[this.chat.length - 1 - h].send_time, this.chat[this.chat.length - 1 - h].num)  
                        })
                        for(let i = 0; i < data[0][0].chat.length; i++) this.check_message(data[0][0].chat[i])
                    }
                })
            }
        },
        make_normal(mes){
            let message = ''
            let n = 0
            let shy = String.fromCharCode(173)
            for(let i = 0; i < mes.length; i++){
                message += mes[i]
                if(mes[i] != ' ') n += 1
                else n = 0
                if(n == 12){
                    message += shy
                    n = 0
                }
            }
            return message
        },
    }
}
</script>

<style scoped>
.main{
    margin-left: 18%;
    margin-right: 18%;
    padding-right: 50px;
    padding-left: 50px;
    margin-top: 56px;
    margin-bottom: 56px;
    min-height: 100%;
}
.friend{
    padding: 2px 10px 2px 10px;
    background-color: #00bfff;
    border-radius: 10px;
    font-size: 11pt;
}
.you{
    padding: 2px 10px 2px 10px;
    background-color: greenyellow;
    border-radius: 10px;
    font-size: 11pt;
}
.time{
    float: right;
}
.name{
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 999;
   background-color: khaki;
   padding: 10px;
   font-weight: bold;
}
.message{
    position: fixed;
    margin-left: auto;
    margin-right: auto;
    z-index: 9999;
    bottom: 0;
    left: 0;
    right: 0;
}
.chat{
    margin-left: auto;
    margin-right: auto;
}
.time_main{
    border-radius: 10px;
    margin: 10px auto 10px auto;
}
.send{
    border-radius: 50%;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 5px;
    height: 42px;
}
.place{
    position: relative;
    height: 44px;
}
.for_chat{
    margin-bottom: 20px;
}
@media screen and (max-width: 767px) {
    .main{
        margin-top: 66px;
        margin-left: 0px;
        margin-right: 0px;
    }
}
@media screen and (max-width: 337px) {
    .main{
        margin-top: 106px;
    }
}
/* @media screen and (max-width: 912px) {
    .place{
        margin-top: -24px;
    }
}
@media screen and (max-width: 483px) {
    .place{
        margin-top: -48px;
    }
}
@media screen and (max-width: 337px) {
    .place{
        margin-top: -12px;
    }
}
@media screen and (max-width: 313px) {
    .place{
        margin-top: -36px;
    }
}
@media screen and (max-width: 280px) {
    .place{
        margin-top: -56px;
    }
}
@media screen and (max-width: 212px) {
    .place{
        margin-top: -80px;
    }
} */
</style>