<template>
    <div class="main justify-content-center">
        <div class="card container-fluid col-12 col-sm-10 col-xl-7 justify-content-center" v-for="item in chats" :key="item" @click="chat(item.users)">
            <div class="card-body row">
                <div v-if="item.avatar.length != 0" v-lazy-container="{ selector: 'img' }">
                    <img :data-src="item.avatar" alt="">
                </div>
                <div v-else>
                    <img v-if="item.gender == 'Male'" src="./../assets/male.jpg" alt="">
                    <img v-else src="./../assets/female.jpg" alt="">
                </div>
                <div class="column" style="margin-left: 10px">
                    <div class='h5'>{{item.name}}</div>
                    {{item.from}}: {{show_last_mess(emoji.emojify(item.message.data))}}
                </div>
                <div class="column time">
                    <div>{{item.time}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import emoji from 'node-emoji'
export default {
    name: 'Chats',
    data(){
        return{
            email: this.$store.getters.email,
            SessionID: this.$store.getters.SessionID,
            user_id: this.$store.state.user_id,
            chats: {},
            emoji: emoji,
        }
    },
    beforeMount(){
        if(this.email != ''){
            let socket = this.$store.state.socket
            fetch(this.$store.state.serverIp+'/getChats', {
                method: 'POST',
                body: JSON.stringify({email: this.email, sessionid: this.SessionID, user_id: this.user_id}),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log("res", response)
                return response.json()
            })
            .then(data => {
                if(data.length == 0) {
                    Swal.fire({
                        icon: 'info',
                        title: "You've not started any chats, see Search friends page",
                    })
                }
                for(let i = 0; i < data.length; i++){
                    if(data[i].users[0] != this.user_id){
                        this.$set(this.chats, data[i].users[0], {avatar: '', name: '', message: '', from: '', time: '', users: []})
                        socket.emit('get_info_for_chats', {id: data[i].users[0], user_id: this.user_id, email: this.email, sessionid: this.SessionID})
                    }
                    else{
                        this.$set(this.chats, data[i].users[1], {avatar: '', name: '', message: '', from: '', time: '', users: []})
                        socket.emit('get_info_for_chats', {id: data[i].users[1], user_id: this.user_id, email: this.email, sessionid: this.SessionID})
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
            socket.on('get_info_for_chats', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    let now = new Date()
                    this.chats[data[0].user_id].name = data[0].name + ' ' + data[0].surname
                    this.chats[data[0].user_id].avatar = data[0].avatar
                    this.chats[data[0].user_id].message = data[1].chat[0].message
                    this.chats[data[0].user_id].users = data[1].users
                    if(data[1].chat[0].from == this.user_id) this.chats[data[0].user_id].from = 'You'
                    else this.chats[data[0].user_id].from = data[0].name + ' ' + data[0].surname
                    let nowYear = now.getFullYear()
                    let nowMonth = now.getMonth()
                    let nowDate = now.getDate()
                    let nowMinutes = now.getMinutes()
                    let difference = now.getTimezoneOffset()
                    let monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    let send_time = new Date(data[1].chat[0].send_time[0], data[1].chat[0].send_time[1], data[1].chat[0].send_time[2], data[1].chat[0].send_time[3] - Math.floor(difference / 60), data[1].chat[0].send_time[4] - difference % 60)
                    if(nowMinutes == send_time.getMinutes() && nowDate == send_time.getDate() && nowMonth == send_time.getMonth() && nowYear == send_time.getFullYear()) this.chats[data[0].user_id].time = 'Just now'
                    else if(nowDate == send_time.getDate() && nowMonth == send_time.getMonth() && nowYear == send_time.getFullYear()){
                        let houres
                        if(send_time.getHours() < 10) houres = '0' + send_time.getHours()
                        else houres = send_time.getHours()
                        if(send_time.getMinutes() < 10) return this.chats[data[0].user_id].time = houres + ':0' + send_time.getMinutes()
                        else return  this.chats[data[0].user_id].time = houres + ':' + send_time.getMinutes()
                    }
                    else if(nowDate - 1 == send_time.getDate() && nowMonth == send_time.getMonth() && nowYear == send_time.getFullYear()) this.chats[data[0].user_id].time = 'Yesterday'
                    else if(nowYear == send_time.getFullYear()) this.chats[data[0].user_id].time = send_time.getDate() + ' ' + monthes[send_time.getMonth()]
                    else this.chats[data[0].user_id].time = monthes[send_time.getMonth()] + ' ' + send_time.getFullYear()
                })
            })
        }
        else document.location.href = '/login'
    },
    methods:{
        chat(users){
            document.location.href = '/chats/' + users[0] + users[1]
        },
        show_last_mess(mess){
            if(mess.length > 50) return mess.slice(0, 50) + '...'
            else return mess
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
    margin-top: 70px;
}
.card-body{
    padding: 5px 10px 5px 20px;
}
.card:hover{
    background-color: #f5f5f5;
    cursor: pointer;
}
img{
    object-fit: cover;
    width: 70px;
    height:70px;
}
.time{
    margin-left: auto;
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