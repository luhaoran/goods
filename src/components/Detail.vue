<template>
  <div>
    <Navbar name="物品详情" />
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

<style>
</style>
