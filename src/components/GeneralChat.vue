<template>
    <div class="main justify-content-center">
        <div class="place">
            <div class="name text-center">General chat</div>
            <div class="dropdown">
                <button class="btn users dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Users
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div v-for="item in users" :key="item.id" :class="'dropdown-item' + check_role(item.role)" disabled>{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="for_chat">
            <div class="chat justify-content-center column" v-for="item in chat" :key="item.message">
                <div class="bg-warning col-9 col-sm-7 col-xl-3 time_main text-center" :id='item.num'></div>
                <div v-if="item.from == user_id" class="row col-12" :id="item.num">
                    <div class="you">
                        <div :class="'font-weight-bold' + check_role(item.role)">{{item.name}}</div>
                        <div v-if="item.deleted == false">{{make_normal(emoji.emojify(item.message.data))}}</div>
                        <div v-else class="font-weight-light font-italic">This message was deleted by administrator</div>
                        <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                    </div>
                </div>
                <div v-else class="row justify-content-start col-12" :id="item.num">
                    <div class="friend" @click="write_name(item.name)">
                        <div :class="'font-weight-bold' + check_role(item.role)">{{item.name}}
                            <button class="btn dropdown-toggle user-info-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <div class="dropdown-item" style="cursor: pointer;" @click="connect(item.from, item.name)">Send a private message</div>
                                <div v-if="role == 'admin'" class="dropdown-item" style="cursor: pointer;" @click="delete_message(item.num)">Delete this message</div>
                                <div v-if="role == 'admin'" class="dropdown-item" style="cursor: pointer;" @click="ban_user(item.from, item.name)">Block this user</div>
                            </div>
                        </div>
                        <div v-if="item.deleted == false">{{make_normal(emoji.emojify(item.message.data))}}</div>
                        <div v-else class="font-weight-light font-italic">This message was deleted by administrator</div>
                        <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                    </div>
                </div>
            </div>
        </div>
         <div class="place">
            <div class="message row container-fluid">
                <textarea type="text" class="" style="width: calc(100% - 47px);" id="message" @input="change_width(), check_text('message', 600)" @keypress.enter="send_message()" placeholder="Enter message"></textarea>
                <button class="send btn btn-info" @click="send_message()"><i class="fas fa-paper-plane"></i></button>
            </div>
         </div>
    </div>
</template>

<script>
import emoji from 'node-emoji'
import Swal from 'sweetalert2'
export default {
    name: 'GeneralChat',
    data(){
        return{
            email: this.$store.getters.email,
            SessionID: this.$store.getters.SessionID,
            user_id: this.$store.state.user_id,
            role: this.$store.state.role,
            users: [],
            chat: [],
            socket: this.$store.state.socket,
            try: true,
            emoji: emoji,
        }
    },
    beforeMount(){
        if(this.email != ''){
            this.get_chat()
            let socket = this.socket
            let get_name = setInterval(() =>{
                if(this.$store.state.name != ''){
                    socket.emit('come_in_general_chat', {user_id: this.user_id, name: this.$store.state.name, role: this.$store.state.role})
                    clearInterval(get_name)
                }
            }, 500)
            let get_role = setInterval(() =>{
                if(this.$store.state.role != ''){
                    this.role = this.$store.state.role
                    clearInterval(get_role)
                }
            }, 500)
            socket.on('new_general_message', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    this.chat.push(data)
                    let pageDown = setInterval(() =>{
                        if(document.getElementById(this.chat.slice(-1)[0].num)){
                            for(let h = 0; h < this.chat.length; h++)this.getInfoTime(this.chat[this.chat.length - 1 - h].send_time, this.chat[this.chat.length - 1 - h].num)  
                            let scrollHeight = Math.max(
                                    document.body.scrollHeight, document.documentElement.scrollHeight,
                                    document.body.offsetHeight, document.documentElement.offsetHeight,
                                    document.body.clientHeight, document.documentElement.clientHeight
                                );
                                if(data.from == this.user_id) window.scrollTo(0,document.body.scrollHeight)
                                else if(scrollHeight - window.pageYOffset <= 1000) window.scrollTo(0,document.body.scrollHeight)
                            clearInterval(pageDown)
                        }
                    }, 100)
                })
            })
            socket.on('come_in_general_chat', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    if(this.users.lastIndexOf(data) == -1){
                        this.users.push(data)
                        if(Swal.isVisible() == false){
                            Swal.fire({
                                position: 'top-end',
                                html: '<div class="' + this.check_role(data.role) + '">' + data.name + ' comes in</div>',
                                customClass: {
                                    container: '.swal2-container',
                                },
                                showConfirmButton: false,
                                toast: true,
                                timer: 2000,
                            })
                        }
                    }
                })
            })
            socket.on('leave_general_chat', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    if(Swal.isVisible() == false){
                        Swal.fire({
                            position: 'top-end',
                            html: '<div class="' + this.check_role(data.role) + '">' + data.name + ' leaves</div>',
                            customClass: {
                                container: '.swal2-container',
                            },
                            showConfirmButton: false,
                            toast: true,
                            timer: 2000,
                        })
                    }
                    for(let i = 0; i < this.users.length; i++){
                        if(this.users[i].id == data.id){
                            this.users.splice(i, 1)
                            return
                        }
                    }

                })
            })
            socket.on('users_in_general_chat', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    if(this.users.lastIndexOf(data) == -1) this.users.push(data)
                })
            })
            socket.on('delete_message', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    for(let i = 0; i < this.chat.length; i++){
                        if(this.chat[i].num == data.num){
                            this.chat[i].deleted = true
                            this.chat.message = ''
                            return
                        }
                    }
                })
            })
            window.onscroll = (() => {
                if (window.pageYOffset == 0) {
                    this.get_chat()
                }
            })
        }
        else document.location.href = '/login'
    },
    beforeDestroy(){
        if(this.email != '') this.socket.emit('leave_general_chat', {user_id: this.user_id, name: this.$store.state.name, role: this.$store.state.role})
        this.chat = []
    },
    methods:{
        getTime(time){
            let now = new Date()
            let difference = now.getTimezoneOffset()
            let send_time = new Date(time[0], time[1], time[2], time[3] - Math.floor(difference / 60), time[4] - difference % 60)
            if(send_time.getMinutes() < 10) return send_time.getHours() + ':0' + send_time.getMinutes()
            else return send_time.getHours() + ':' + send_time.getMinutes()
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
            let status = setInterval(() =>{
                if(this.$store.state.banned == false && this.$store.state.name != ''){
                    clearInterval(status)
                    let message = document.getElementById('message').value
                    if(message.trim().length != 0){
                        this.socket.emit('new_message', {email: this.email, sessionid: this.SessionID, message: emoji.unemojify(message), type: 'text', from: this.user_id, name: this.$store.state.name, role: this.$store.state.role})
                    }
                    document.getElementById('message').value = ''
                }
                else if(this.$store.state.banned){
                    clearInterval(status)
                    document.getElementById('message').value = ''
                    let now = new Date()
                    let time = this.$store.state.ban_time
                    let reason = this.$store.state.reason
                    let images = this.$store.state.images
                    let difference = now.getTimezoneOffset()
                    let monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    let show_time
                    if(time[0] != 'forever'){
                        let ban_time = new Date(time[0], time[1], time[2] + 1, time[3] - Math.floor(difference / 60), time[4] - difference % 60)
                        let houres
                        let minutes
                        if(ban_time.getHours() < 10) houres = '0' + ban_time.getHours()
                        else houres = ban_time.getHours()
                        if(ban_time.getMinutes() < 10) minutes = ':0' + ban_time.getMinutes()
                        else minutes = ':' + ban_time.getMinutes()
                        show_time = 'until ' + ban_time.getDate() + ' ' + monthes[ban_time.getMonth()] + ' ' + ban_time.getFullYear() + ' ' + houres + minutes
                    }
                    else show_time = 'at all'
                    Swal.fire({
                        title: 'You were banned by administrator', 
                        html:   `You can't write any messages ${show_time}` +
                                '<br>' +
                                `Reason: ${reason}` +
                                `<img width="350" height="230" src="${images}" alt="">`,
                    })
                }
            }, 100)
        },
        get_chat(){
            if(this.try){
                fetch(this.$store.state.serverIp+'/getGeneralChat', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, num: this.chat.length}),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                    console.log("res", response)
                    return response.json()
                })
                .then(data => {
                    if(data[0].chat.length == 0 || data[0].chat.length < 20){
                        this.try = false
                    }
                    let chat = data[0].chat.reverse()
                    let elem
                    if(this.chat.length != 0) elem = document.getElementById(this.chat.slice(0)[0].num)
                    for(let j = 0; j <  chat.length; j++){
                        this.chat.unshift(chat[j])
                    }
                    let pageDown = setInterval(() =>{
                        if(document.getElementById(this.chat.slice(-1)[0].num)){
                            setTimeout(() => {
                                clearInterval(pageDown)
                                for(let h = 0; h < this.chat.length; h++)this.getInfoTime(this.chat[this.chat.length - 1 - h].send_time, this.chat[this.chat.length - 1 - h].num)  
                                if(this.chat.length <= 20) window.scrollTo(0,document.body.scrollHeight)
                                else if(data.length != 0) elem.scrollIntoView()
                            }, 150)
                        }
                    }, 100)
                })
            }
        },
        check_role(role){
            if(role == 'admin') return ' text-danger'
            else return ''
        },
        connect(id, name){
            Swal.fire({
                title: 'Connect with ' + name,
                showCancelButton: true,
                confirmButtonText: 'Send',
                input: 'text',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }
                    else if(value != emoji.emojify(this.$store.state.check_text(emoji.unemojify(value), 500))){
                        return 'Incorrect message!'
                    }
                    else{
                        fetch(this.$store.state.serverIp+'/addChat', {
                            method: 'POST',
                            body: JSON.stringify({email: this.email, sessionid: this.SessionID, id: id, user_id: this.$store.state.user_id, message: value}),
                            headers: {
                                "Content-Type": "application/json"
                            },
                        })
                        .then(response => {
                            console.log("res", response)
                            return response.json()
                        })
                        .then(() => {
                            document.location.href = '/chats/' + this.$store.state.user_id + id
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                }
            })
        },
        delete_message(num){
            this.socket.emit('delete_message', {email: this.email, sessionid: this.SessionID, role: this.$store.state.role, num: num})
        },
        ban_user(user, name){
            Swal.fire({
                title: 'Are you sure that you want to ban ' + name + '?',
                html:   '<div class="input-group-prepend">'+
                            '<select class="custom-select custom-select-sm form-control" id="ban_reason" style="height: 38px;">' +
                                '<option value="choose_reason" selected>Choose reason</option>' +
                                '<option value="Obscene lexicon">Obscene lexicon</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="input-group-prepend">'+
                            '<select class="custom-select custom-select-sm form-control" id="ban_time" style="height: 38px;">' +
                                '<option value="choose_time" selected>Choose ban time</option>' +
                                '<option value="24">24 hours</option>' +
                                '<option value="forever">Forever</option>' +
                            '</select>' +
                        '</div>' +
                        '<br>' +
                        'Choose images' +
                        '<input type="file" class="" id="reason_files" accept="image/*" multiple>',
                showCancelButton: true,
                preConfirm: () => {
                    let reason = document.getElementById('ban_reason')
                    let files = document.getElementById('reason_files').files
                    let time = document.getElementById('ban_time')
                    let send = true
                    if(reason.value == 'choose_reason'){
                        send = false
                        Swal.showValidationMessage(
                            'Choose any reason'
                        )
                    }
                    else if(time.value == 'choose_time'){
                        send = false
                        Swal.showValidationMessage(
                            'Choose ban time'
                        )
                    }
                    else if(files.length == 0){
                        send = false
                        Swal.showValidationMessage(
                            'Choose any images'
                        )
                    }
                    else if(send){
                        let data = []
                        for(let i = 0; i < files.length; i++){
                            let reader = new FileReader();
                            let file = files[i]
                            reader.readAsDataURL(file);
                            let email = this.email
                            let SessionID = this.SessionID
                            let url = this.$store.state.serverIp
                            reader.onload = function () {
                                data.push(reader.result)
                                if(i == files.length - 1){
                                    alert()
                                    fetch(url+'/banUser', {
                                        method: 'POST',
                                        body: JSON.stringify({email: email, sessionid: SessionID, user: user, reason: reason.value, ban: time.value, images: data, role: this.$store.state.role}),
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                    })
                                    .then(response => {
                                        console.log("res", response)
                                        return response.json()
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                            }
                            reader.onerror = function (error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    showConfirmButton: false,
                                    text: 'Unpredictable error, please, try again',
                                    timer: 2000
                                })
                                console.log('Error: ', error);
                            };
                        }
                    }
                    // this.socket.emit('ban_user', {email: this.email, sessionid: this.SessionID, user: user, ban: ban})
                }
            })
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
        write_name(name){
            document.getElementById('message').value += name + ', '
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
    cursor: pointer;
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
.info{
    margin-left: auto;
    margin-right: auto;
}
.users{
    position: fixed;
    margin-left: 35%;
    height: 44px;
    margin-top: auto;
    z-index: 999;
}
.dropdown-menu{
    max-height: 200px;
    overflow-y: auto;
}
.form-control:focus{
    box-shadow: 0 0 0 0.2rem coral;
    border-color: coral;
}
.img{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.user-info-btn{
    padding-bottom: 0px;
}
@media screen and (max-width: 767px) {
    .main{
        margin-top: 66px;
        margin-left: 0px;
        margin-right: 0px;
    }
    .users{
        margin-left: 65%;
    }
}
/* @media screen and (min-width: 913px) {
    .place{
        margin-top: -24px;
    }
}
@media screen and (max-width: 912px) {
    .place{
        margin-top: -48px;
    }
}
@media screen and (max-width: 483px) {
    .place{
        margin-top: -72px;
    }
} */
@media screen and (max-width: 337px) {
    .main{
        margin-top: 106px;
    }
    .users{
        margin-left: 60%;
    }
}
/* @media screen and (max-width: 313px) {
    .place{
        margin-top: -96px;
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