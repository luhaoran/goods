<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="订单详情" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Eachorder",
  components: {
    Navbar
  },
  data() {
    return {}
      
  },
  created() {},
  mounted() {},

  methods: {
    
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {}
};
</script>

<style lang="less" scope>

</style>
