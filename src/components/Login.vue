<template>
    <div class="main">
        <div class="container col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6" style="background: linear-gradient(45deg, #EECFBA, #C5DDE8);">
            <div class="form-row justify-content-center" style="padding-top: 10px;">
                <h1 class="h2">Log in</h1>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Email</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                        <input @change="check('email'), check_text('email')" type="email" class="form-control" id="email" placeholder="example@gmail.com">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Password</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></div>
                        <input @change="check('password')" type="password" class="form-control" id="password" placeholder="Password">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                     <button type="submit" class="btn btn-primary" @click="check()">Log in</button>
                </div>
            </div>
            <div class="form-row d-flex justify-content-center">
                <router-link class="col-6 router-link d-flex justify-content-center" to="/registration">Don't have an account?</router-link>
                <router-link class="col-6 router-link d-flex justify-content-center" to="/">Forgot password?</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import needle from 'needle'
import Swal from 'sweetalert2'
export default {
    name: 'Login',
    data(){
        return{
            serverIp: this.$store.state.serverIp,
        }
    },
    methods:{
        check(value){
            let login = false
            if(value == undefined){
                let list = ['email', 'password']
                login = true
                for(let i = 0; i < 2; i++){
                    update(list[i], this.serverIp)
                }
            }
            else{
                update(value, this.serverIp)
            }
            function update(value, url){
                let obj = document.getElementById(value)
                if(obj.value.trim() == ''){
                    obj.style.boxShadow = '0 0 0 0.2rem red'
                    obj.style.borderColor = 'red'
                    login = false
                }
                else{
                    obj.style.boxShadow = ''
                    obj.style.borderColor = ''
                    if(value == 'password' && login) loginUser(url)
                }
            }
            function loginUser(url){
                let email = document.getElementById('email').value.toLowerCase()
                let password = document.getElementById('password').value
                let data = {email: email.trim(), password: password}
                needle.post(url + '/login', data, {"json": true}, function(err, res){
                    let data = JSON.parse(res.body)
                    if(err){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            showConfirmButton: false,
                            text: 'Unpredictable error, please, try again',
                            timer: 2000
                        })
                        console.log(err)
                    }
                    else if(data == 'login failed'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Email or password is incorrect',
                            timer: 2000
                        })
                    }
                    else{
                        Swal.fire({
                            icon: 'success',
                            title: "You logged in successfully",
                            showConfirmButton: false,
                            timer: 2000
                        })
                        document.cookie = "email=" + email + "; expires=" + new Date(Date.now() + 864000e3).toUTCString()
                        document.cookie = "SessionID=" + data.sessionid + "; expires=" + new Date(Date.now() + 864000e3).toUTCString()
                        document.cookie = "user_id=" + data.user_id + "; expires=" + new Date(Date.now() + 864000e3).toUTCString()
                        setTimeout(() => {
                            document.location.href = "/profile"
                        }, 2000);
                    }
                })
            }
        },
        check_text(elem){
            let el = document.getElementById(elem)
            el.value = this.$store.state.check_text(el.value)
        },
    },
}
</script>

<style scoped>
.main{
    margin-left: 18%;
    margin-right: 18%;
    padding-right: 50px;
    padding-left: 50px;
    min-height: 100%;
    margin-top: 100px;
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