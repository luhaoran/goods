<template>
  <van-nav-bar :title="name" :left-arrow="isHome" @click-left="onClickLeft" />
</template>
<script>
export default {
  name: "Navbar",
  props: {
    name: String
  },
  data() {
    return {
      footer: [
        {
          icon: require("../..//public/images/md2-ft-1.png"),
          name: "首页",
          to:'/'
        },
        {
          icon: require("../..//public/images/md2-ft-2.png"),
          name: "搜索",
          to:'/search'
        },
        {
          icon: require("../..//public/images/md2-ft-3.png"),
          name: "购物车",
          to:'cartlist'
        },
        {
          icon: require("../..//public/images/md2-ft-4.png"),
          name: "我的",
          to:'/user'
        }
      ],
    };
  },
  methods: {
      onClickLeft(){
          this.$router.go('-1')
          console.log("-1")
      }
  },
  computed:{
      isHome(){
        let is = true
        this.footer.forEach(el => {
          if(this.name === el.name){
            is =  false;
          }
        });
        return is   
      }
  }
};
</script>