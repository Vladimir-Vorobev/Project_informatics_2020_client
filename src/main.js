import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuex from 'vuex';
import VueLazyload from 'vue-lazyload'
import VueYandexMetrika from 'vue-yandex-metrika'
import { APP_STORE } from '../store';

import MainPage from './components/MainPage.vue'
import Login from './components/Login.vue'
import Registration from './components/Registration.vue'
import Profile from './components/Profile.vue'
import Search from './components/Search.vue'
import Chats from './components/Chats.vue'
import PrivateChat from './components/PrivateChat.vue'
import GeneralChat from './components/GeneralChat.vue'
import Admin from './components/Admin.vue'
import PageNotFound from './components/PageNotFound.vue'
import TestVideo from './components/TestVideo.vue'
import TestFiles from './components/TestFiles.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueLazyload)
Vue.use(Vuex)

const routes = [
  { path: '/', component: MainPage },
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
  { path: '/profile', component: Profile },
  { path: '/search', component: Search },
  { path: '/chats', component: Chats },
  { path: '/chats/:id', component: PrivateChat },
  { path: '/general-chat', component: GeneralChat },
  { path: '/admin', component: Admin },
  { path: '/test-video', component: TestVideo },
  { path: '/test-files', component: TestFiles },
  { path: '/404', component: PageNotFound }, { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'history',
  routes, // сокращённая запись для `routes: routes`
})

Vue.use(VueYandexMetrika, {
  id: 66844615,
  router: router,
  env: process.env.NODE_ENV
})

const store = new Vuex.Store(APP_STORE);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
