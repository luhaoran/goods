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

Vue.use(vueRouter);

const router = new vueRouter({
  mode:'history',
  routes: [  //配置路由，这里是个数组
    {
      path:'/',
      redirect:'/home'
    },
    {
      path:'/home',
      component:Home
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/cartlist',
      component:Cartlist
    },
    {
      path:'/search',
      component:Search
    },
    {
      path:'/close',
      component:Close
    },
    {
      path:'/addorder',
      component:Addorder
    },
    {
      path:'/selectaddress',
      component:Selectaddress
    },
    {
      path:'/addaddress',
      component:Addaddress
    }
  ]             
})


// router.beforeEach((to,from,next)=>{
//   const token = sessionStorage.getItem("token")
//   if(to.path == '/login' && token){
//     return next("/home");
//   }else if(to.path == '/login'){
//     return next();
//   }
  
//   if(!token) return next("/login");
//   next();
// })

// router.afterEach(()=>{
//   NProgress.done()
// })

export default  router