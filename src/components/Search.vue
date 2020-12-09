<template>
    <div class="main">
        <div class="form-row text-right">
            <button class="btn btn-info" @click="show_filter()">Filter</button>
        </div> <br>
        <div class="form-row justify-content-center" id="filter" style="display: none;">
            <div class="form-group col-12">
                <div class="container-fluid col-12" id="hobbies_list">
                    <div class="form-row col-12">
                        <div class="form-row col-12">
                            <div class="h6" v-if="state_filters.length != 0"><pre>State filter: </pre></div> 
                            <div class="form-group" v-for="item in state_filters" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_filter(item, 'state_filters')"> {{item}}  </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="form-row col-12">
                            <div class="h6" v-if="city_filters.length != 0"><pre>City filter: </pre></div> 
                            <div class="form-group" v-for="item in city_filters" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_filter(item, 'city_filters')"> {{item}}  </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="form-row col-12">
                            <div class="h6" v-if="name_filters.length != 0"><pre>Name filter: </pre></div> 
                            <div class="form-group" v-for="item in name_filters" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_filter(item, 'name_filters')"> {{item}}  </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="form-row col-12">
                            <div class="h6" v-if="surname_filters.length != 0"><pre>Surname filter: </pre></div> 
                            <div class="form-group" v-for="item in surname_filters" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_filter(item, 'surname_filters')"> {{item}}  </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="form-row col-12">
                            <div class="h6" v-if="gender_filters.length != 0"><pre>Gender filter: </pre></div> 
                            <div class="form-group" v-for="item in gender_filters" :key="item"><pre><input type="checkbox" checked :value="item" :id="item" @click="add_filter(item, 'gender_filters')"> {{item}}  </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="form-row col-12" v-if="age_filters_min[0] != 7 || age_filters_max[0] != 17">
                            <div class="h6"><pre>Age filter: </pre></div> 
                            <div class="form-group"><pre><input type="checkbox" checked @click="add_filter('age_filters')"> From {{age_filters_min[0]}} to {{age_filters_max[0]}} </pre></div>
                        </div>
                    </div>
                    <div class="form-row col-12">
                        <div class="column col-6">
                            <div class="form-column form-group col-12">
                                <select class="custom-select custom-select-sm form-control" id="state_filters" @input="add_filter('state_filters')" style="height: 38px;">
                                    <option v-for="(item, name) in countries" :key="item.value" :value="name">{{name}}</option>
                                </select>
                                <small id="passwordHelpBlock" class="form-text text-muted">Choose a state to add it as a filter</small>
                            </div>
                            <div class="form-column form-group col-12">
                                <select class="custom-select custom-select-sm form-control" id="city_filters" @input="add_filter('city_filters')" style="height: 38px;">
                                    <option v-if="city_filters.length == 0"></option>
                                    <option v-for="item in countries[state_filters[0]]" :key="item.value" :value="item">{{item}}</option>
                                </select>
                                <small id="passwordHelpBlock" class="form-text text-muted">Choose a city to add it as a filter</small>
                            </div>
                            <div class="form-column form-group col-12">
                                <input class="form-control" id="name_filters" @keydown.enter="add_filter('name_filters')" @input="check_text('name_filters', 20)">
                                <small id="passwordHelpBlock" class="form-text text-muted">Write a name and press enter to add it as a filter</small>
                            </div>
                            <div class="form-column form-group col-12">
                                <input class="form-control" id="surname_filters" @keydown.enter="add_filter('surname_filters')" @input="check_text('surname_filters', 20)">
                                <small id="passwordHelpBlock" class="form-text text-muted">Write a surname and press enter to add it as a filter</small>
                            </div>
                            <div class="form-column form-group col-12">
                                <select class="custom-select custom-select-sm form-control" id="gender_filters" @input="add_filter('gender_filters')" style="height: 38px;">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <small id="passwordHelpBlock" class="form-text text-muted">Choose a gender to add it as a filter</small>
                            </div>
                            <div class="form-column form-group col-12">
                                <select class="custom-select custom-select-sm form-control col-6" id="age_filters_min" @input="add_filter('age_filters_min')" style="height: 38px;">
                                    <option v-for="item in age_counter" :key="item" :value="item" :id="item" :style="show_option(item, 'm')">{{item}}</option>
                                </select>
                                <select class="custom-select custom-select-sm form-control col-6" id="age_filters_max" @input="add_filter('age_filters_max')" style="height: 38px;">
                                    <option v-for="item in age_counter" :key="item" :value="item" :id="item" :style="show_option(item)">{{item}}</option>
                                </select>
                                <small id="passwordHelpBlock" class="form-text text-muted">Choose an age diapason "from to" to add it as a filter</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h3 text-center">{{no_users}}</div>
        <div v-for="item in search_list" :key="item">
            <div class="card" :id="item.user_id">
                <div class="card-header h4">{{item.name}} {{item.surname}}</div>
                <div class="card-body row">
                    <div v-if="item.avatar.length != 0" class="col-12 col-md-5" v-lazy-container="{ selector: 'img' }">
                        <img :data-src="item.avatar" alt="">
                    </div>
                    <div v-else class="col-12 col-md-5">
                        <img v-if="item.gender == 'Male'" src="./../assets/male.jpg" alt="">
                        <img v-else src="./../assets/female.jpg" alt="">
                    </div>
                    <div class="col-12 col-md-7">
                        <h5 class="card-title" v-if="item.about.length != 0">About: {{item.about}}</h5>
                        <p class="card-text" v-if="item.hobbies.length != 0">Hobbies: {{item.hobbies.join(', ')}}</p>
                        <p><span class="card-text">State: {{item.state}}</span></p>
                        <p class="card-text">City: {{item.city}}</p>
                        <p class="card-text">Age: {{show_age(item.age)}}</p>
                        <p class="card-text">Gender: {{item.gender}}</p>
                        <button class="btn btn-success"  @click="connect(item.user_id, item.name, item.surname)">Connect with user</button>
                    </div>
                </div>
            </div><br>
        </div>
        <button v-if="try_to_search" class="btn btn-info" @click="change_info()">Show more</button>
    </div>
</template>

<script>
import emoji from 'node-emoji'
import countries_cities from 'all-countries-and-cities-json'
import Swal from 'sweetalert2'
export default {
    name: 'Search',
    data(){
        return{
            search_list: [],
            email: this.$store.getters.email,
            SessionID: this.$store.getters.SessionID,
            state_filters: [],
            city_filters: [],
            hobby_filters: [],
            name_filters: [],
            surname_filters: [],
            gender_filters: [],
            age_filters_min: [7],
            age_filters_max: [17],
            countries: countries_cities,
            age_counter: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            no_users: '',
            users_ids: [],
            try_to_search: true,
            socket: this.$store.state.socket,
            search_place: '',
        }
    },
    beforeMount(){
        if(this.email != ''){
            this.change_info()
            this.socket.on('search_list', (data) => {
                new Promise(function(resolve) {
                    resolve(data)
                })
                .then((data) => {
                    if(data == "no_data"){
                        if(this.search_list.length == 0) this.no_users = 'There are no users'
                        this.try_to_search = false
                    }
                    else{
                        this.no_users = ''
                        this.search_list.push(data)
                        this.users_ids.push(data.user_id)
                    }
                    document.getElementById('state_filters').value = ''
                    document.getElementById('city_filters').value = ''
                    document.getElementById('gender_filters').value = ''
                    document.getElementById('age_filters_min').value = ''
                    document.getElementById('age_filters_max').value = ''
                    let pageDown = setInterval(() =>{
                        if(document.getElementById(data.user_id)){
                            setTimeout(() => {
                                clearInterval(pageDown)
                                if(this.search_place == '') window.scrollTo(0,0)
                                else document.getElementById(this.search_place).scrollIntoView()
                            }, 100)
                        }
                    }, 100)
                })
            })
        }
        else document.location.href = '/login'
    },
    mounted(){
        document.getElementById('state_filters').value = ''
        document.getElementById('city_filters').value = ''
        document.getElementById('gender_filters').value = ''
        document.getElementById('age_filters_min').value = ''
        document.getElementById('age_filters_max').value = ''
    },
    methods:{
        check_text(elem, size){
            let el = document.getElementById(elem)
            el.value = emoji.emojify(this.$store.state.check_text(emoji.unemojify(el.value), size))
        },
        show_filter(){
            let filter = document.getElementById('filter')
            if(filter.style.display == 'none') filter.style.display = 'block'
            else filter.style.display = 'none'
        },
        add_filter(elem, arr){
            if(arr != undefined){
                this[arr].splice(this[arr].lastIndexOf(elem), 1)
                if(this.city_filters.length == 0) document.getElementById('city_filters').value = ''
                this.users_ids = []
                this.search_list = []
                this.try_to_search = true
                this.change_info()
            }
            else if(elem == 'age_filters'){
                this.age_filters_min[0] = 7
                this.age_filters_max[0] = 17
                this.users_ids = []
                this.search_list = []
                this.try_to_search = true
                this.change_info()
            }
            else{
                if(this[elem].lastIndexOf(document.getElementById(elem).value) == -1 && document.getElementById(elem).value.trim() != ''){
                    if(elem != 'hobbies_filters' && elem != 'city_filters') this[elem] = []
                    this[elem].push(document.getElementById(elem).value)
                    this.users_ids = []
                    this.search_list = []
                    this.try_to_search = true
                    this.change_info()
                }
                document.getElementById(elem).value = ''
            }
        },
        show_age(age){
            let date = new Date()
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            if(month < age.slice(5,7)) return year - age.slice(0,4) - 1
            else if(month > age.slice(5,7)) return year - age.slice(0,4)
            else{
                if(day >= age.slice(8)) return year - age.slice(0,4)
                else return year - age.slice(0,4) - 1
            }
        },
        show_option(elem, param){
            if(param != undefined){
                if(this.age_filters_max < elem) return 'display: none;'
            }
            else{
                if(this.age_filters_min > elem) return 'display: none;'
            }
        },
        // show_pointed_data(elem, name){
        //     if(name == 'state'){
        //         if(this.state_filters.lastIndexOf(elem) != -1) return 'box-shadow: 0 0 0 0.2rem #082567; border-color: #082567'
        //         else return ''
        //     }
        // },
        change_info(){
            if(this.try_to_search && this.$store.state.user_id != ''){
                fetch(this.$store.state.serverIp+'/getSearchList', {
                    method: 'POST',
                    body: JSON.stringify({email: this.email, sessionid: this.SessionID, users_ids: this.users_ids, user_id: this.$store.state.user_id, filters: {state_filters: this.state_filters, city_filters: this.city_filters, name_filters: this.name_filters, surname_filters: this.surname_filters, gender_filters: this.gender_filters, age_filters_min: this.age_filters_min, age_filters_max: this.age_filters_max}}),
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
                    document.location.href = "/login"
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                if( this.search_list.length != 0) this.search_place = this.search_list.slice(-1)[0].user_id
            }
        },
        connect(id, name, surname){
            if(this.$store.state.email == '') document.location.href = '/login'
            Swal.fire({
                title: 'Connect with ' + name + ' ' + surname,
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
    margin-top: 70px;
}
img{
    object-fit: cover;
    width: 250px;
    height: 250px;
}
@media screen and (max-width: 767px) {
    .main{
        margin-left: 0px;
        margin-right: 0px;
    }
}
@media screen and (max-width: 1130px) {
    img{
        object-fit: cover;
        width: 200px;
        height: 200px;
    }
}
@media screen and (max-width: 930px) {
    img{
        object-fit: cover;
        width: 150px;
        height: 150px;
    }
}
@media screen and (max-width: 767px) {
    img{
        object-fit: cover;
        width: 250px;
        height: 250px;
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
@media screen and (max-width: 337px) {
    .main{
        margin-top: 130px;
    }  
}
</style>