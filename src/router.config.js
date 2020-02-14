import Vue from 'vue'
import vueRouter from 'vue-router';
import Login from './components/Login'
import Home from './components/Home'
import Cartlist from './components/Cartlist'
import Search from './components/Search'
import Close from './components/Close'
import Addorder from './components/Addorder'
import Selectaddress from './components/Selectaddress'
import Addaddress from './components/Addaddress'
import User from './components/User'
import Order from './components/Order'
import Eachorder from './components/Eachorder'
import Orderquit from './components/Orderquit'
import Orderscore from './components/Orderscore'
import Count from './components/Count'
import Coupon from './components/Coupon'
import Feedback from './components/Feedback'

Vue.use(vueRouter);

const router = new vueRouter({
  mode: 'history',
  routes: [  //配置路由，这里是个数组
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/cartlist',
      component: Cartlist
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/close',
      component: Close
    },
    {
      path: '/addorder',
      component: Addorder
    },
    {
      path: '/selectaddress',
      component: Selectaddress
    },
    {
      path: '/addaddress',
      component: Addaddress
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/order',
      component: Order
    },
    {
      path: '/eachorder',
      component: Eachorder
    },
    {
      path: '/orderquit',
      component: Orderquit
    },
    {
      path: '/orderscore',
      component: Orderscore
    },
    {
      path: '/count',
      component: Count
    },
    {
      path: '/coupon',
      component: Coupon
    },
    {
      path: '/feedback',
      component: Feedback
    }
  ]
})


router.beforeEach((to,from,next)=>{
  const user = localStorage.getItem("user")
  // if(to.path == '/login' && user){
  //   return next("/home");
  // }else if(to.path == '/login'){
  //   return next();
  // }

  //如果要前往user页面，且缓存中user为空，则跳转到登陆页面
  if(to.path == '/user' && !user){
    // http://yvc7nc.natappfree.cc/
    // return window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx32b7a6d9cf485cb8&redirect_uri=http://yvc7nc.natappfree.cc/login&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    next()
  }

  next()
  
})

// router.afterEach(()=>{
//   NProgress.done()
// })

export default router