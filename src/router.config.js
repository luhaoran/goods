import Vue from 'vue'
import vueRouter from 'vue-router';
import Login from './components/Login'
import Home from './components/Home'
import Cartlist from './components/Cartlist'
import Search from './components/Search'
import Detail from './components/Detail'

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
      path:'/detail',
      component:Detail
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