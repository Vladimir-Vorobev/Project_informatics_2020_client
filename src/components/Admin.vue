<template>
    <div class="main">
        <transition-group name="main">
            <div v-if="!show" key="div" class="container login col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6" style="background: linear-gradient(45deg, #EECFBA, #C5DDE8);">
                <div class="form-row justify-content-center">
                    <div class="form-group col-10">
                        <label for="inputEmail4">Password</label>
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></div>
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                    </div>
                </div>
                <div class="form-row justify-content-center">
                    <div class="form-group col-10">
                        <button type="submit" class="btn btn-primary" @click="get_in()">Get in panel</button>
                    </div>
                </div>
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="show" key="div" class="place">
               <ul class="nav nav-pills almbb-pills mb-3 justify-content-center dop-nav" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" @click="show_add_people()" id="pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">Add people</a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" @click="show_read_chats(), get_chat()" id="pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">Read private chats</a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" @click="show_general_chat_archive(), get_chat('general')" id="pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">Read general chat archive</a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" @click="show_ban_people()" id="pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">Ban people</a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" @click="show_complaints()" id="pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">Complaints</a>
                    </li>
                </ul>
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="add_people" key="div">
                <div class="container inf col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6" style="background: linear-gradient(45deg, #EECFBA, #C5DDE8);">
                    <div class="form-row justify-content-center">
                        <div class="form-group col-10">
                            <label for="inputEmail4">Email</label>
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                                <input type="email" class="form-control" id="email" @input="add_person()" placeholder="example@gmail.com">
                            </div>
                        </div>
                    </div>
                    <div class="form-row justify-content-center">
                        <div class="form-group col-10">
                            <label for="inputEmail4">Role</label>
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-user-tag" aria-hidden="true"></i></div>
                                <select class="custom-select custom-select-sm form-control" @input="add_person()" id="role" style="height: 38px;">
                                    <option value="choose_role" selected>Choose role</option>
                                    <option value="user">User</option>
                                    <option value="premium">Premium</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row justify-content-center">
                        <div class="form-group col-10">
                            <button type="submit" class="btn btn-primary" @click="add_person(true)">Add person</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="read_chats" key="div" class="inf">
                <div class="for_chat">
                    <div class="chat col-12 col-sm-10 justify-content-center column" v-for="item in chat" :key="item.message">
                        <div class="row" :id="item.num">
                            <div v-if="item.from == users[0]" class="user">
                                <div :class="'font-weight-bold' + check_role(item.role)">{{item.from}}
                                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <div class="dropdown-item" style="cursor: pointer;" @click="ban_user(item.from, item.name)">Block this user</div>
                                    </div>
                                </div>
                                <div>{{make_normal(emoji.emojify(item.message.data))}}</div>
                                <div v-if="item.deleted == true" class="font-weight-light font-italic">This message was deleted by administrator</div>
                                <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                            </div>
                            <div v-else class="user2">
                                <div :class="'font-weight-bold' + check_role(item.role)">{{item.from}}
                                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <div class="dropdown-item" style="cursor: pointer;" @click="ban_user(item.from, item.name)">Block this user</div>
                                    </div>
                                </div>
                                <div>{{make_normal(emoji.emojify(item.message.data))}}</div>
                                <div v-if="item.deleted == true" class="font-weight-light font-italic">This message was deleted by administrator</div>
                                <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="place">
                    <div class="change row container-fluid">
                        <button class="btn btn-info btn-change" @click="change_chat()">Change chat</button>
                    </div>
                </div>
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="read_general_chat" key="div" class='inf'>
                <div class="for_chat">
                    <div class="chat col-12 col-sm-10 justify-content-center column" v-for="item in general_chat" :key="item.message">
                        <div class="row" :id="item.num">
                            <div class="user">
                                <div :class="'font-weight-bold' + check_role(item.role)">{{item.name}}
                                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <div class="dropdown-item" style="cursor: pointer;" @click="ban_user(item.from, item.name)">Block this user</div>
                                    </div>
                                </div>
                                <div v-if="item.deleted == true" class="font-weight-light font-italic">This message was deleted by administrator</div>
                                <div v-else>{{make_normal(emoji.emojify(item.message.data))}}</div>
                                <small class="time font-weight-light font-italic">{{getTime(item.send_time)}}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="place">
                    <div class="change row container-fluid">
                        <button class="btn btn-info btn-change" @click="delete_archive()">Delete archive</button>
                    </div>
                </div>
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="ban_people" key="div" class="inf">
                3
            </div>
        </transition-group>
        <transition-group name="main">
            <div v-if="complaints" key="div" class="inf">
                4
            </div>
        </transition-group>
    </div>
</template>

<script>
import emoji from 'node-emoji'
import Swal from 'sweetalert2'
export default {
    name: 'Admin',
    data(){
        return{
            email: this.$store.getters.email,
            SessionID: this.$store.getters.SessionID,
            show: false,
            add_people: false,
            read_chats: false,
            ban_people: false,
            complaints: false,
            read_general_chat: false,
            try: true,
            socket: this.$store.state.socket,
            chat: [],
            general_chat: [],
            users: [],
            emoji: emoji,
        }
    },
    beforeMount(){
        window.onscroll = (() => {
            if (window.pageYOffset == 0 && this.read_chats) {
                this.get_chat()
            }
        })
    },
    methods:{
        get_in(){
            fetch(this.$store.state.serverIp+'/login', {
                method: 'POST',
                body: JSON.stringify({email: this.email, password: document.getElementById('password').value}),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log("res", response)
                return response.json()
            })
            .then((data) => {
                if(data == 'login failed'){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Email or password is incorrect',
                        timer: 2000
                    })
                }
                if(data.role == 'admin'){
                    this.show = true
                    this.add_people = true
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "You don't have access to this page",
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        add_person(access){
            let email = document.getElementById('email')
            let role = document.getElementById('role')
            let change = true
            if(email.value.trim() == ''){
                email.style.boxShadow = '0 0 0 0.2rem red'
                email.style.borderColor = 'red'
                change = false
            }
            else{
                email.style.boxShadow = ''
                email.style.borderColor = ''
            }
            if(role.value == 'choose_role'){
                role.style.boxShadow = '0 0 0 0.2rem red'
                role.style.borderColor = 'red'
                change = false
            }
            else{
                role.style.boxShadow = ''
                role.style.borderColor = ''
            }
            if(change && access){
                fetch(this.$store.state.serverIp+'/addPerson', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, person_email: email.value.trim(), role: role.value, admin_role: this.$store.state.role}),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                    console.log("res", response)
                    return response.json()
                })
                .then((data) => {
                    if(data == 'No users'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'There are no users with such email',
                        })
                    }
                    else if(data == 'OK'){
                        Swal.fire({
                            icon: 'success',
                            title: 'The role of this user was changed successfully',
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        },
        getTime(time){
            let now = new Date()
            let difference = now.getTimezoneOffset()
            let send_time = new Date(time[0], time[1], time[2], time[3] - Math.floor(difference / 60), time[4] - difference % 60)
            if(send_time.getMinutes() < 10) return send_time.getHours() + ':0' + send_time.getMinutes()
            else return send_time.getHours() + ':' + send_time.getMinutes()
        },
        get_chat(general){
            if(general){
                fetch(this.$store.state.serverIp+'/getRandomChat', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, role: this.$store.state.role}),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                    console.log("res", response)
                    return response.json()
                })
                .then(data => {
                    let chat = data[0].chat.reverse()
                    for(let j = 0; j <  chat.length; j++){
                        this.general_chat.unshift(chat[j])
                    }
                    let pageDown = setInterval(() =>{
                        if(document.getElementById(this.general_chat.slice(-1)[0].num)){
                            clearInterval(pageDown)
                            window.scrollTo(0,document.body.scrollHeight)
                        }
                    }, 100)
                })
            }
            else if(this.try){
                fetch(this.$store.state.serverIp+'/getRandomChat', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, num: this.chat.length, users: this.users, role: this.$store.state.role}),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => {
                    console.log("res", response)
                    return response.json()
                })
                .then(data => {
                    this.users = data[0].users 
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
                            clearInterval(pageDown)
                            if(this.chat.length <= 20) window.scrollTo(0,document.body.scrollHeight)
                            else if(data.length != 0) elem.scrollIntoView()
                        }
                    }, 100)
                })
            }
        },
        check_role(role){
            if(role == 'admin') return ' text-danger'
            else return ''
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
                            let role = this.$store.state.role
                            reader.onload = function () {
                                data.push(reader.result)
                                if(i == files.length - 1){
                                    fetch(url+'/banUser', {
                                        method: 'POST',
                                        body: JSON.stringify({email: email, sessionid: SessionID, user: user, reason: reason.value, ban: time.value, images: data, role: role}),
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
        change_chat(){
            let chat = this.chat.length
            this.try = true
            for(let j = 0; j < 2; j++){
                this.users.splice(0, 1)
            }
            for(let i = 0; i < chat; i++){
                this.chat.splice(0, 1)
            }
        },
        delete_archive(){
            fetch(this.$store.state.serverIp+'/deleteArchive', {
                method: 'POST',
                body: JSON.stringify({email: this.email, sessionid: this.SessionID, role: this.$store.state.role}),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log("res", response)
                return response.json()
            })
            .then(data => {
                if(data == "OK") this.general_chat = []
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        showConfirmButton: false,
                        text: 'Unpredictable error, please, try again',
                        timer: 2000
                    })
                }
            })
        },
        show_add_people(){
            this.add_people = true
            this.read_chats = false
            this.read_general_chat = false
            this.ban_people = false
            this.complaints = false
        },
        show_read_chats(){
            this.read_chats = true
            this.read_general_chat = false
            this.add_people = false
            this.ban_people = false
            this.complaints = false
        },
        show_general_chat_archive(){
            this.read_general_chat = true
            this.read_chats = false
            this.add_people = false
            this.ban_people = false
            this.complaints = false
        },
        show_ban_people(){
            this.ban_people = true
            this.add_people = false
            this.read_chats = false
            this.read_general_chat = false
            this.complaints = false
        },
        show_complaints(){
            this.complaints = true
            this.add_people = false
            this.read_chats = false
            this.read_general_chat = false
            this.ban_people = false
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
    min-height: 100%;
    margin-top: 56px;
}
label, h1{
    color: white;
    font-weight: 400;
}
.form-control{
    border-radius: 50px;
}
.input-group-text{
    margin-right: 5px;
    border-radius: 50%;
}
.form-control:focus{
    box-shadow: 0 0 0 0.2rem coral;
    border-color: coral;
}
.form-text{
    margin-left: 52px;
}
.router-link{
    text-decoration: none;
    color: black;
}
.main-enter-active{
  transition: opacity .5s;
}
.main-leave-active{
    transition: opacity;
}
.main-enter, .main-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.show-enter-active {
  transition: opacity .5s;
}
.show-enter /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.nav-item{
    cursor: pointer;
    margin-right: 10px;
    margin-top: 10px;
}
.user{
    padding: 10px;
    background-color: greenyellow;
    border-radius: 10px;
}
.user2{
    padding: 10px;
    background-color: #00bfff;
    margin-left: auto;
    border-radius: 10px;
}
.chat{
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 10px;
    padding-top: 1px;
}
.for_chat{
    margin-bottom: 20px;
}
.change{
    position: fixed;
    margin-left: auto;
    margin-right: auto;
    z-index: 9999;
    bottom: 0;
    left: 0;
    right: 0;
}
.place{
    position: relative;
    height: 110px;
}
.btn-change{
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: auto;
}
.dop-nav{
    position: fixed;
    z-index: 999;
    padding: 10px;
    background-color: white;
    width: 64%;
    margin-left: -50px;
}
.login{
    margin-top: 70px;
}
@media screen and (max-width: 792px) {
    .place{
        height: 140px;
    }
}
@media screen and (max-width: 493px) {
    .place{
        height: 200px;
    }
}
@media screen and (max-width: 337px) {
    .login, .inf{
        margin-top: 130px;
    }
    .place{
        margin-top: 106px;
        height: 70px;
    }
}
@media screen and (max-width: 318px) {
    .login, .inf{
        margin-top: 160px;
    }
}
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
    .dop-nav{
        width: 100%;
    }
}
</style>