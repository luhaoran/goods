<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="券包" />
    <van-coupon-list
      :coupons="coupons"
      :disabled-coupons="disCoupons"
      :show-exchange-bar="false"
      close-button-text="关闭"
      @change="close"
    />
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Coupon",
  components: {
    Navbar
  },
  data() {
    return {
      coupons: [],
      disCoupons: []
    };
  },
  created() {},
  mounted() {
    let redTip = this.redTip;
    redTip[2] = 0;
    this.redTipSave(redTip)
    
    this.getCoupon();
  },

  methods: {
    ...mapMutations(['redTipSave']),
    getCoupon() {
      const user = this.user;
      this.$axios.get("/getCoupon", { params: { user } }).then(({ data }) => {
        if (data.status === 1) {
          let coupons = data.arr.map(item => {
            const condition =
              parseFloat(item.info.orderPrice) > 0
                ? `满${item.info.orderPrice}可用`
                : "无门槛券";
            return {
              id: item.id,
              value: parseFloat(item.info.price) * 100,
              name: item.info.title,
              startAt: Math.round(
                new Date(item.time).getTime() / 1000
              ).toString(),
              endAt: Math.round(
                new Date(item.expiryTime).getTime() / 1000
              ).toString(),
              condition,
              description: `仅限以下商品可用：${item.proName}`,
              valueDesc: item.info.price.toString()
            };
          });
          this.coupons = coupons;
        }
      });
    },
    close(id) {
      id < 0 && this.$router.go(-1);
    }
  },
  computed: {
    ...mapState(["user","redTip"])
  },
  watch: {}
};
</script>

<style lang="less" scope>
</style>
