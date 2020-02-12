<template>
  <div>
    <van-overlay :show="show">
      <div class="close">
        <div>
            <h2>暂停营业</h2>
            <h5>{{setting.closeInfo}}</h5>
        </div>
        
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Close",

  data() {
    return {
      show: true
    };
  },
  created() {},
  mounted() {},

  computed: {
    ...mapState(["setting"])
  },
  watch: {}
};
</script>

<style  lang="less" scoped>
.van-overlay {
  z-index: 999999 !important;
}
.close{
    height: 90%;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    margin: 0 10%;
}
</style>
