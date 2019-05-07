import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueSocketio from 'vue-socket.io'
import './assets/index.less'


Vue.config.productionTip = false
export const PRODUCTION = process.env.NODE_ENV === 'production';

let url = PRODUCTION ? 'http://106.12.198.147:8000' : 'localhost:8000' 

Vue.use(new VueSocketio({
    connection:url
}))
if (window.require) {
  Vue.prototype.$ipcRenderer = window.require('electron').ipcRenderer
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
