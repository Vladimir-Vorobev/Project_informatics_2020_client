<template>
    <div class="main">
        <div class="container-fluid col-12 col-sm-10" style="background: linear-gradient(45deg, #EECFBA, #C5DDE8);">
            <div class="form-row justify-content-center" style="padding-top: 10px;">
                <h1 class="h2">Profile</h1>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Name</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></div>
                        <input @input="check('name'), check_text('name', 20), update_value()" class="form-control" id="name" :value="name">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Surname</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></div>
                        <input @input="check('surname'), check_text('surname', 20), update_value()" type="email" class="form-control" id="surname" :value="surname">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Avatar</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text" style="height: 38px;"><i class="fas fa-user-tie" aria-hidden="true"></i></div>
                        <input type="file" id="avatar" accept="image/*" v-if="avatar == ''" style="margin-left: 42px;">
                        <div class="form-group text-center" v-if="avatar != ''" v-lazy-container="{ selector: 'img' }"><img :data-src="avatar" alt=""></div>
                    </div>
                    <input type="file" id="avatar" accept="image/*" v-if="avatar != ''" style="margin-left: 42px;">
                </div>
            </div>
            <button v-if="avatar != ''" class="form-row btn btn-danger" style="margin-left: 95px" @click="delete_avatar()">Delete avatar</button>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">About yourself</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="far fa-address-card" aria-hidden="true"></i></div>
                        <input class="form-control" id="about" @input="check_text('about', 300), update_value()" :value="about">
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Hobbies</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-snowboarding" aria-hidden="true"></i></div>
                        <input type="email" :value="hobbies.join(', ')" class="form-control" id="hobbies" @click="show_hobbies()" readonly>
                    </div>
                    <small id="passwordHelpBlock" class="form-text text-muted">
                        Push to choose
                    </small>
                    <div class="container-fluid col-12" id="hobbies_list" style="display: none;">
                        <div class="form-row justify-content-center">
                            <div class="h5" v-if="hobbies.length != 0">Your hobbies</div> <br>
                            <div class="form-row form-group col-12">
                                <div class="" v-for="item in hobbies" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_hobby(item)"> {{item}}  </pre></div>
                            </div> 
                            <div class="h5">Sports games</div> <br>
                            <div class="form-row form-group col-12">
                                <div class="" v-for="item in sports_games" :key="item"><pre v-if="hobbies.lastIndexOf(item) == -1"><input type="checkbox" :value="item" :id="item" @click="add_hobby(item)"> {{item}}  </pre></div>
                            </div>
                            <div class="h5">Playing musical instruments</div>
                            <div class="form-row form-group col-12"> <br>
                                <div class="" v-for="item in musical_instruments" :key="item"><pre v-if="hobbies.lastIndexOf(item) == -1"><input type="checkbox" :value="item" :id="item" @click="add_hobby(item)"> {{item}}  </pre></div>
                            </div>  
                            <div class="h5">Fighting</div>
                            <div class="form-row form-group col-12"> <br>
                                <div class="" v-for="item in fighting" :key="item"><pre v-if="hobbies.lastIndexOf(item) == -1"><input type="checkbox" :value="item" :id="item" @click="add_hobby(item)"> {{item}}  </pre></div>
                            </div> 
                            <div class="h5">Dancing</div>
                            <div class="form-row form-group col-12"> <br>
                                <div class="" v-for="item in dancing" :key="item"><pre v-if="hobbies.lastIndexOf(item) == -1"><input type="checkbox" :value="item" :id="item" @click="add_hobby(item)"> {{item}}  </pre></div>
                            </div>
                        </div>
                        <div class="form-row justify-content-center">
                            <div class="form-column form-group col-12">
                                <input type="email" class="form-control" id="person_hobby" @input="check_text('person_hobby', 30)" @keyup.enter="add_person_hobby()">
                            </div>
                            <small id="passwordHelpBlock" class="form-text text-muted">Write a hobby and push enter to add</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Email</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                        <input type="email" class="form-control" id="email" :value='email' readonly>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">State</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-flag-usa" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="state" @input="check('state'), update_value()" style="height: 38px;">
                            <option :value="country" selected>{{country}}</option>
                            <option v-for="(item, name) in countries" :key="item.value" :value="name">{{name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">City</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-building" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="city" @input="check('city'), update_value()" style="height: 38px;">
                            <option :value="city" selected>{{city}}</option>
                            <option v-for="item in countries[country]" :key="item.value" :value="item">{{item}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Age</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-calendar-alt" aria-hidden="true"></i></div>
                        <input type="date" id="age" class="form-control" min-date='01.01.1900' :value="age" @input="check('age'), update_value()" required readonly>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                    <label for="inputEmail4">Gender</label>
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-venus-mars" aria-hidden="true"></i></div>
                        <select class="custom-select custom-select-sm form-control" id="gender" style="height: 38px;">
                            <option v-if="gender != 'Male'" @click="gender = 'Male', update_value()">Male</option>
                            <option v-else selected>Male</option>
                            <option v-if="gender != 'Female'" @click="gender = 'Female', update_value()">Female</option>
                            <option v-else selected>Female</option>
                            <option v-if="gender != 'Other'" @click="gender = 'Other', update_value()">Other</option>
                            <option v-else selected>Other</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-row justify-content-center">
                <div class="form-group col-11">
                     <button type="submit" class="btn btn-primary" @click="check()">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import needle from 'needle'
import Swal from 'sweetalert2'
import countries_cities from 'all-countries-and-cities-json'
import emoji from 'node-emoji'
export default {
    name: 'Profile',
    data(){
        return{
            serverIp: this.$store.state.serverIp,
            name: '',
            surname: '',
            avatar: '',
            about: '',
            hobbies: [],
            email: '',
            countries: countries_cities,
            country: '',
            city: '',
            age: '',
            gender: '',
            sports_games: ['football', 'baseball', 'basketball', 'hockey', 'golf', 'water polo'],
            musical_instruments: ['guitar', 'banjo', 'ukulele', 'piano', 'violin', 'cello', 'contrabass', 'accordion', 'bayan', 'mouth organ', 'drum', 'flute', 'clarinet', 'oboe', 'bassoon', 'tube', 'saxophone', 'tuba', 'trombone', 'french horn'],
            fighting: ['karate', 'boxing', 'sambo', 'ju-jitsu', 'judo', 'taekwondo', 'aikido', 'sumo', 'wushu', 'kung fu'],
            dancing: ['hip hop', 'break dance', 'electrodance', 'R&B', 'house', 'ballroom dancing', 'folk dancing'],
        }
    },
    beforeMount(){
      let email = this.$store.getters.email
      let SessionID = this.$store.getters.SessionID
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
              document.location.href = "/login"
            }
            this.name = data.name
            this.surname = data.surname
            this.avatar = data.avatar
            this.about = data.about
            this.hobbies = data.hobbies
            this.email = data.email
            this.country = data.state
            this.city = data.city
            this.age = data.age
            this.gender = data.gender
        })
        .catch(err => {
            console.log(err)
        })
      }
      else{
          document.location.href = "/login"
      }
    },
    methods:{
        check(value){
            let update = false
            let email = this.$store.getters.email
            let hobbies = this.hobbies
            let SessionID = this.$store.getters.SessionID
            let country = this.country
            let avatar = this.avatar
            if(value == undefined){
                let list = ['name', 'surname', 'email', 'state', 'city', 'age', 'gender']
                update = true
                for(let i = 0; list.length; i++){
                    upd(list[i], this.serverIp, avatar)
                }
            }
            else{
                upd(value, this.serverIp, avatar)
            }
            function upd(value, url, avatar){
                let obj = document.getElementById(value)
                if(obj.value.trim() == ''){
                    obj.style.boxShadow = '0 0 0 0.2rem red'
                    obj.style.borderColor = 'red'
                    update = false
                }
                else if(value == 'gender'){
                    if(obj.value != 'Male' && obj.value != 'Female' && obj.value != 'Other'){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        update = false
                    }
                    else{
                        obj.style.boxShadow = ''
                        obj.style.borderColor = ''
                        if(update) updateUser(url, avatar)
                    }
                }
                else if(value == 'state'){
                    if(obj.value == 'not_stated' || countries_cities[obj.value] == undefined){
                        obj.style.boxShadow = '0 0 0 0.2rem red'
                        obj.style.borderColor = 'red'
                        update = false
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
                        update = false
                    }
                }
                else{
                    obj.style.boxShadow = ''
                    obj.style.borderColor = ''
                }
            }
            function updateUser(url, avatar){
                if(document.getElementById('avatar').files[0] != undefined){
                    let reader = new FileReader();
                    let file = document.getElementById('avatar').files[0]
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        send(reader.result, url)
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
                else send(avatar, url)
            }
            function send(person_photo, url){
                let name = document.getElementById('name').value
                let surname = document.getElementById('surname').value
                let about = document.getElementById('about').value
                let state = document.getElementById('state').value
                let city = document.getElementById('city').value
                let age = document.getElementById('age').value
                let gender = document.getElementById('gender').value
                let data = {email: email, name: name, surname: surname, avatar: person_photo, about: about, hobbies: hobbies, state: state, city: city, age: age, gender: gender, sessionid: SessionID}
                needle.post(url + '/updateUser', data, {"json": true}, function(err, res){
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
                    else if(res.body == '310'){
                        document.cookie = "email=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                        document.cookie = "SessionID=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
                        document.location.href = "/login"
                    }
                    else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Your data was updated successfully',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        setTimeout(() => {
                            window.location.reload()
                        }, 2000);
                    }
                })
            }
        },
        check_text(elem, size){
            let el = document.getElementById(elem)
            el.value = emoji.emojify(this.$store.state.check_text(emoji.unemojify(el.value), size))
        },
        show_hobbies(){
            let hobbies = document.getElementById('hobbies_list')
            if(hobbies.style.display == 'none') hobbies.style.display = 'block'
            else hobbies.style.display = 'none'
        },
        add_hobby(name){
            let hobby = document.getElementById(name)
            if(hobby.checked && this.hobbies.lastIndexOf(name) == -1) this.hobbies.push(name)
            else this.hobbies.splice(this.hobbies.lastIndexOf(name), 1)
            document.getElementById('hobbies').value = this.hobbies.join(', ')
        },
        add_person_hobby(){
            let hobby = document.getElementById('person_hobby').value.trim()
            hobby = hobby.toLowerCase()
            let real_hobby = ''
            if(hobby.length != 0){
                let n = 0
                for(let i = 0; i < hobby.length; i++){
                    if(hobby[i] == ' '){
                        n += 1
                        if(n == 1){
                            real_hobby += hobby[i]
                        }
                    }
                    else{
                        n = 0
                        real_hobby += hobby[i]
                    }
                }
                this.hobbies.push(real_hobby)
            }
            document.getElementById('person_hobby').value = ''
        },
        update_value(){
            this.name = document.getElementById('name').value
            this.surname = document.getElementById('surname').value
            this.email = document.getElementById('email').value
            this.about = document.getElementById('about').value
            this.country = document.getElementById('state').value
            this.city = document.getElementById('city').value
            this.age = document.getElementById('age').value
            this.gender = document.getElementById('gender').value
        },
        delete_avatar(){
            this.avatar = ''
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
img{
    object-fit: cover;
    width: 300px;
    height: 300px;
}
@media screen and (max-width: 900px) {
    img{
        object-fit: cover;
        width: 200px;
        height: 200px;
    }
}
@media screen and (max-width: 400px) {
    img{
        object-fit: cover;
        width: 150px;
        height: 150px;
    }
}
@media screen and (max-width: 350px) {
    img{
        object-fit: cover;
        width: 100px;
        height: 100px;
    }
}
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>