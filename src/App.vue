<template>
 <div id="app" style="height: 100% !important;">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/Navbar.vue'
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  components: { NavBar },
  computed: { ...mapGetters(['email', 'allEventsScroll', 'openDaysScroll']) },
  beforeCreate(){
    let dataq = document.cookie.split(";")
    let socket = this.$store.state.socket
    let name = ''
    let b = 0
    for(let i = 0; i < dataq.length; i++){
    let value = dataq[i].toString()
        for(let j = 0; j < value.length; j++){
            if(dataq[i][j] == "="){
                if(name == 'email'){
                    b = 1
                }
                else if(name == 'SessionID'){
                    b = 2
                }
                else if(name == 'user_id'){
                    b = 3
                } 
                name = ''
            }
            else if(dataq[i][j] != " "){
                name += dataq[i][j]
            }
        }
        if(b == 1){
            this.$store.commit('GET_USER_EMAIL', name)
            b = 0
        }
        else if(b == 2){
            this.$store.commit('GET_USER_SESSIONID', name)
            b = 0
        }
        else if(b == 3){
            this.$store.state.user_id = name
            socket.emit('new_user', name)
            b = 0
        }
        name = ''
    }
    socket.on('ban_user', (data) => {
        this.$store.state.banned = true
        this.$store.state.ban_time = data.date
        this.$store.state.reason = data.reason
        this.$store.state.images = data.images
    })
    let rec = false
    socket.on('connect', () => {
        new Promise(function(resolve) {
            resolve()
        })
        .then(() => {
            if(rec){
                window.location.reload()
            }
        })
    })
    socket.on('disconnect', () => {
        rec = true
    })
  },
}
</script>

<style>
::-webkit-scrollbar {
    width: 0.5em;
    height: 0.4em;
    background: transparent;
}
::-webkit-scrollbar-corner {
    display: none;
}
::-webkit-scrollbar-thumb {
    background: #afafaf;
    border-radius: 0.2em;
}
html{
    scrollbar-color: #afafaf transparent; 
    scrollbar-width: thin;
    scrollbar-face-color: #afafaf ;
    scrollbar-track-color: transparent;
}
body {
    width:100% !important; 
    height:100% !important;
    margin: 0px;
    background-color: rgb(255, 239, 248);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  /* background-color: white; */
   background-color: rgb(255, 239, 248);
}
.swal2-container {
    margin-top: 100px;
    margin-right: 18%;
}
@media screen and (max-width: 767px) {
    .swal2-container {
        margin-top: 150px;
        margin-right: 0px;
    }
}
@media screen and (max-width: 337px) {
    .swal2-container {
        margin-top: 150px;
    }
}
</style>