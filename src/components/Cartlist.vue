<template>
  <div style="padding-bottom:50px">
    <Navbar name="购物车" />
    <template v-if="cartList.length >0">
      <van-card
        v-for="item in cartList"
        :key="JSON.stringify(item)"
        :num="item.selNum"
        :price="item.price"
        :desc="item.info"
        :title="item.name"
        :thumb="getZhutu(item)"
      >
        <div slot="footer">
          <van-button round size="mini" @click="numRed(item)">-</van-button>
          <van-button round size="mini" @click="numAdd(item)">+</van-button>
        </div>
      </van-card>
    </template>
    <div v-else class="noCartListDiv">
      <i class="iconfont icon-cart"></i>
      <p>这里空空如也</p>
    </div>
    <van-submit-bar :price="totalPrice*100" button-text="提交订单" @submit="onSubmit" />
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "CartList",
  components: {
    Navbar
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},

  methods: {
    ...mapMutations(["cartListSave"]),
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    numAdd(item) {
      item.selNum += 1;
      this.cartListSave(this.cartList);
    },
    numRed(item) {
      item.selNum -= 1;
      if (item.selNum === 0) {
        let cartList = this.cartList;
        const has = cartList.findIndex(el => el.id == item.id);
        cartList.splice(has, 1);
        this.cartListSave(cartList);
      }
      this.cartListSave(this.cartList);
    },
    gotoHome() {
      this.$router.push("/home");
    },
    onSubmit() {
      if (this.cartList.length == 0) {
        return Notify({ type: "danger", message: "请先添加商品！" });
      }
      const totalPrice = this.totalPrice;
      if (totalPrice < this.setting.outsidePrice) {
        return Notify({
          type: "warning",
          message: "购物车商品还未达到起送金额！"
        });
      }

      this.$router.push("/addorder");
    }
  },
  computed: {
    ...mapState(["domain", "cartList", "setting", "totalPrice"])
  }
};
</script>

<style lang="less" scoped>
.van-button--mini {
  min-width: 35px !important;
}
.van-submit-bar {
  bottom: 50px !important;
}
</style>
