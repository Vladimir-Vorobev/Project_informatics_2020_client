<template>
    <div>
        <div class="navbar navbar-expand-md navbar-dark bg-primary" @click="animate_navbar()">
            <router-link class="navbar-brand" to="/">Christopher Robin Club</router-link>
            <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <div class="navbar-toggler bg-dark">
                    <span class="navbar-toggler-icon useful"></span>
                </div>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto" v-if="screen_width <= 767">
                    <li class="nav-item">
                        <router-link to="/chats" class="nav-link">Private chats</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/search" class="nav-link">Search friends</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/general-chat" class="nav-link">General chat</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/policy" class="nav-link">Site policy</router-link>
                    </li>
                </ul>
                <div class="dropdown" v-if="loginText != 'Log in'">
                    <button class="btn btn-success dropdown-toggle user" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{loginText}}</button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                        <router-link :to="loginLink" class="dropdown-item">Profile</router-link>
                        <router-link v-if="role == 'admin'" to="/admin" class="dropdown-item">Admin panel</router-link>
                        <div class="dropdown-item text-danger" @click="exit()">Exit</div>
                    </div>
                </div>
                <router-link v-else :to="loginLink" class="btn btn-success">{{loginText}}</router-link>
            </div>
        </div>
        <div class="nav-left" v-if="screen_width > 767">
            <div class="nav">
                <ul class="navbar-nav mr-auto col-12">
                    <li class="nav-item item">
                        <router-link to="/chats" class="nav-link">Private chats</router-link>
                    </li>
                    <li class="nav-item item">
                        <router-link to="/search" class="nav-link">Search friends</router-link>
                    </li>
                    <li class="nav-item item">
                        <router-link to="/general-chat" class="nav-link">General chat</router-link>
                    </li>
                    <li class="nav-item item">
                        <router-link to="/policy" class="nav-link">Site policy</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="nav-right" v-if="screen_width > 767"><div class="nav-r"></div></div>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    data(){
        return{
            loginText: 'Log in',
            loginLink: '/login',
            role: '',
            screen_width: window.innerWidth,
        }
    },
    created() {
        window.addEventListener('resize', this.updateWidth);
    },
    beforeMount(){
        let email = this.$store.getters.email
        let SessionID = this.$store.getters.SessionID
        let getRole = setInterval(() => {
            if(this.$store.state.role != ''){
                clearInterval(getRole)
                this.role = this.$store.state.role
            }
        }, 100)
        if(email != '' && SessionID != ''){
            fetch(this.$store.state.serverIp+'/getInformation', {
                method: 'POST',
                body: JSON.stringify({email: email, sessionid: SessionID}),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log("res", response)
                return response.json()
            })
            .then(data => {
                if(data == '310'){
                    document.cookie = "email=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                    document.cookie = "SessionID=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                    document.cookie = "user_id=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                    window.location.reload()
                }
                this.$store.state.ban_time = data.ban_time
                this.$store.state.banned = data.banned
                this.$store.state.reason = data.reason
                this.$store.state.images = data.ban_images
                this.$store.state.name = data.name + ' ' + data.surname
                this.$store.state.role = data.role
                this.loginText = data.name + ' ' + data.surname
                this.loginLink = '/profile'
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    methods:{
        updateWidth(){
            this.screen_width = window.innerWidth
        },
      exit(){
        document.cookie = "email=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie = "SessionID=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.location.href = "/login"
      },
      animate_navbar(){
          if(event.target.classList.contains('useful') == false && event.target.classList.contains('navbar-toggler') == false && event.target.classList.contains('user') == false){
                document.querySelector('.navbar-collapse').classList.remove('show')
                document.querySelector('.navbar-toggler').classList.remove('active')
          }
      },
    }
}
</script>

<style scoped>
.navbar{
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 9999;
}
.show{
    z-index: 9999;
}
.nav{
    background-color: #eef5ff;
    width: 18%;
    min-height: 100vh;
    position: fixed;
    left: 0;
    z-index: 9998;
}
.nav-r{
    background-color: #eef5ff;
    width: 18%;
    min-height: 100vh;
    position: fixed;
    right: 0;
    z-index: 9998;
}
.nav-left{
    position: absolute;
    margin-top: 56px;
}
.nav-right{
    position: absolute;
    margin-top: 56px;
}
.item{
    margin-left: 10%;
}
.nav-link{
    color: black;
}
</style>