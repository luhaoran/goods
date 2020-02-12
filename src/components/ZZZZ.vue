<template>
  <div>
    <Navbar name="搜索" />
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="search"/>
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Search",
  components: {
    Navbar
  },
  data() {
    return {
      searchValue:''
    };
  },
  created() {},
  mounted() {},

  methods: {
    ...mapMutations(["settingSave"]),
    search(){
      const searchValue = this.searchValue;
      this.$axios.get(`/searchPros?searchValue=${searchValue}`).then(res=>{
        console.log(res)
      })
    }
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
</style>
