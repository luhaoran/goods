<template>
  <van-nav-bar :title="name" :left-arrow="name != '首页'" @click-left="onClickLeft" />
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
      }
  },
  computed:{
     
  }
};
</script>