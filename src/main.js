import Vue from 'vue';
import Index from './components/Index';
import router from './router.config'; //路由
import axios from 'axios'
import store from './store.config' //vuex
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.prototype.$axios = axios
// axios.defaults.baseURL = "/10005"
axios.defaults.baseURL = "https://good.pinge.pro/10005"

//axios传输数据时，在headers中添加Authorization
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = sessionStorage.getItem('token')
//   return config
// })


Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(Index),
}).$mount('#app')
