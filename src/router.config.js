import Vue from 'vue'
import vueRouter from 'vue-router';
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
import Article from './components/Article'
import Return from './components/Return'
import Userreg from './components/Userreg'
import Userlogin from './components/Userlogin'

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
    },
    {
      path: '/article',
      component: Article
    },
    {
      path: '/return',
      component: Return
    },
    {
      path: '/userreg',
      component: Userreg
    },
    {
      path: '/userlogin',
      component: Userlogin
    }
  ]
})


router.beforeEach((to,from,next)=>{
  const user = localStorage.getItem("user")
  const userInfo = localStorage.getItem("userInfo")

  //如果前往用户中心或者下单页面，检查是否登陆，未登录跳转至登陆页面
  if((to.path == '/user' || to.path == '/addorder') && !user && !userInfo){
    return next("/userlogin");
  }

  next()
  
})

// router.afterEach(()=>{
//   NProgress.done()
// })

export default router