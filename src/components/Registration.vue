<template>
    <div class="main">
        <div class="container col-12 col-sm-10 col-md-8 col-lg-7 col-xl-7" style="background: linear-gradient(45deg, #EECFBA, #C5DDE8);">
            <div class="form-row justify-content-center" style="padding-top: 10px;">
                <h1 class="h2">Registration</h1>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Name</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></div>
                        <input @input="check('name'), check_text('name', 20)" type="email" class="form-control" id="name" placeholder="John">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Surname</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></div>
                        <input @input="check('surname'), check_text('surname', 20)" type="email" class="form-control" id="surname" placeholder="Bond">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Email</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                        <input @input="check('email')" class="form-control" id="email" placeholder="example@gmail.com">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">State</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-flag-usa" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="state" @input="check('state'), change_country()" style="height: 38px;">
                            <option value="not_stated" selected>Choose your state</option>
                            <option v-for="(item, name) in countries" :key="item.value" :value="name">{{name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">City</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-building" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="city" @input="check('city')" style="height: 38px;">
                            <option value="not_stated" selected>Choose your city</option>
                            <option v-for="item in countries[country]" :key="item.value" :value="item">{{item}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Age</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-calendar-alt" aria-hidden="true"></i></div>
                        <input type="date" id="age" class="form-control" :min="min_date()" :max="max_date()" @input="check('age')" required>
                    </div>
                    <small id="passwordHelpBlock" class="form-text text-muted">You won't be able to change it</small>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Gender</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-venus-mars" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="gender" @input="check('gender')" style="height: 38px;">
                            <option value="not_stated" selected>Choose your gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Password</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></div>
                        <input @input="check('password'), check_text('password', 15)" type="password" class="form-control" id="password" placeholder="Password">
                    </div>
                    <small id="passwordHelpBlock" class="form-text text-muted">
                        The password should contain 6-15 symbols, whitespaces are forbidden
                    </small>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                    <label for="inputEmail4">Repeat your password</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-lock" aria-hidden="true"></i></div>
                        <input @input="check('password2')" type="password" class="form-control" id="password2" placeholder="Password">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center code" style="display: none;">
                <div class="form-group col-10">
                    <label for="inputEmail4">Access code</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-check-square-o" aria-hidden="true"></i></div>
                        <input class="form-control" id="code" placeholder="123456789">
                    </div>
                    <small id="passwordHelpBlock" class="form-text text-muted">
                        Code was send into your email
                    </small>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-10">
                     <button type="submit" class="btn btn-primary" @click="check()">Sign up</button>
                </div>
            </div>
            <router-link class="form-row justify-content-center router-link" to="/login">Do you have an account?</router-link>
        </div>
    </div>
</template>

<script>
import needle from 'needle'
import Swal from 'sweetalert2'
import countries_cities from 'all-countries-and-cities-json'
import emoji from 'node-emoji'
export default {
    name: 'Registration',
    data(){
        return{
            serverIp: this.$store.state.serverIp,
            countries: countries_cities,
            country: '',
        }
    },
    methods:{
        check(value){
            let country = this.country
            let registrate = false
            if(value == undefined){
                let list = ['name', 'surname', 'email', 'state', 'city', 'age', 'gender', 'password', 'password2']
                registrate = true
                for(let i = 0; i < list.length; i++){
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
                    registrate = false
                }
                else if(value == 'gender'){
                    if(obj.value != 'Male' && obj.value != 'Female' && obj.value != 'Other'){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        registrate = false
                    }
                    else{
                        obj.style.boxShadow = ''
                        obj.style.borderColor = ''
                    }
                }
                else if(value == 'state'){
                    if(obj.value == 'not_stated' || countries_cities[obj.value] == undefined){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        registrate = false
                    }
                    else{
                        obj.style.boxShadow = ''
                        obj.style.borderColor = ''
                    }
                }
                else if(value == 'city'){
                    let con = countries_cities[country]
                    let num = true
                    for(let city in con){
                        if(con[city] == obj.value){
                            obj.style.boxShadow = ''
                            obj.style.borderColor = ''
                            num = false
                        }
                    }
                    if(num){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        registrate = false
                    }
                }
                else if(obj.value.length < 6 || obj.value.length > 15 || obj.value.lastIndexOf(' ') != -1){
                    if(value == 'password'){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        registrate = false
                    }
                    else{
                        obj.style.boxShadow = ''
                        obj.style.borderColor = ''
                        if(value == 'password2' && registrate) addUser(url)
                    }

                }
                else{
                    obj.style.boxShadow = ''
                    obj.style.borderColor = ''
                    if(value == 'password2' && registrate) addUser(url)
                }
            }
            function addUser(url){
                let re = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                let name = document.getElementById('name').value
                let surname = document.getElementById('surname').value
                let email = document.getElementById('email').value.toLowerCase()
                let state = document.getElementById('state').value
                let city = document.getElementById('city').value
                let age = document.getElementById('age').value
                let gender = document.getElementById('gender').value
                let password = document.getElementById('password').value
                let password2 = document.getElementById('password2').value
                if(re.test(email) == false){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        showConfirmButton: false,
                        text: 'You specify the incorrect email',
                        timer: 2000
                    })
                }
                else if(password != password2){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        showConfirmButton: false,
                        text: "Passwords don't match",
                        timer: 2000
                    })
                }
                else if(document.querySelector('.code').style.display == 'none'){
                    let data = {email: email}
                    needle.post(url + '/code', data, {"json": true}, function(err, res){
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
                        else if(res.body == 'invalid email'){
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                showConfirmButton: false,
                                text: 'A user has already registered with this email',
                                timer: 2000
                            })
                        }
                        else{
                            Swal.fire({
                                icon: 'info',
                                title: 'The access key was send into your email',
                            })
                            document.querySelector('.code').style.display = 'flex'
                        }
                    })
                }
                else{
                    let code = document.getElementById('code')
                    if(code.value.trim() == ''){
                        code.style.boxShadow = '0 0 0 0.2rem red'
                        code.style.borderColor = 'red'
                    }
                    else{
                        code.style.boxShadow = ''
                        code.style.borderColor = ''
                        let data = {name: name, surname: surname, email: email.trim(), state: state, city: city, age: age, gender: gender, password: password, code: code.value}
                        needle.post(url + '/registration', data, {"json": true}, function(err, res){
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
                            else if(res.body == 'reg failed'){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    showConfirmButton: false,
                                    text: 'The access code is wrong',
                                    timer: 2000
                                })
                            }
                            else{
                                Swal.fire({
                                    icon: 'success',
                                    title: 'You regged in successfully',
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                                setTimeout(() => document.location.href = "/login", 2000)
                            }
                        })
                    }
                }
            }
        },
        change_country(){
            let state = document.getElementById('state').value
            this.country = state
        },
        check_text(elem, size){
            let el = document.getElementById(elem)
            el.value = emoji.emojify(this.$store.state.check_text(emoji.unemojify(el.value), size))
        },
        min_date(){
            let now = new Date()
            let day = now.getDate()
            let month = now.getMonth() + 1
            if(day < 10) day = '0' + day
            if(month < 10) month = '0' + month
            let year = now.getFullYear() - 18
            return year + '-' + month + '-' + day
        },
        max_date(){
            let now = new Date()
            let day = now.getDate() - 1
            let month = now.getMonth() + 1
            if(day < 10) day = '0' + day
            if(month < 10) month = '0' + month
            let year = now.getFullYear()
            return year + '-' + month + '-' + day
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
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>