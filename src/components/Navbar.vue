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
          if(this.name === '首页') return false;
          return true
      }
  }
};
</script>