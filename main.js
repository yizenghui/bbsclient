import Vue from 'vue'
import App from './App'


import login from "./components/login.vue";
Vue.component('login',login)

import wechat from "./components/wechat.vue";
Vue.component('wechat',wechat)
import contact from "./components/contact.vue";
Vue.component('contact',contact)
import support from "./components/support.vue";
Vue.component('support',support)

import notice from "./components/notice.vue";
Vue.component('notice',notice)
	
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

 



