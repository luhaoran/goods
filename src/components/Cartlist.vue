<template>
  <div>
    <Navbar name="购物车" />
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
    <van-submit-bar :price="totalPrice" button-text="提交订单" @submit="onSubmit" />
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "CartList",
  components: {
    Navbar
  },
  data() {
    return {
      totalPrice:0.0
    };
  },
  created() {},
  mounted() {
    //   const { cartList } = this.$store.state;
    //   console.log(cartList)
    this.calcTotalPrice()
  },

  methods: {
    ...mapMutations(["cartListSave", "cartNumsAdd", "cartNumsRed"]),
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    numAdd(item) {
      item.selNum += 1;
      this.cartNumsAdd();
      this.calcTotalPrice()
    },
    numRed(item) {
      item.selNum -= 1;
      this.cartNumsRed();
      this.calcTotalPrice()
      if (item.selNum === 0) {
        let cartList = this.cartList;
        const has = cartList.findIndex(el => el.id == item.id);
        cartList.splice(has, 1);
        this.cartListSave(cartList);
      }
    },
    calcTotalPrice(){
      const cartList = this.cartList;
      let totalPrice = 0
      cartList.forEach(el => {
        let total = parseFloat(el.price) * el.selNum
        totalPrice += total
        console.log(total,totalPrice)
      });
      this.totalPrice = totalPrice * 100
    },
    onSubmit(){

    }
  },
  computed: {
    ...mapState(["domain", "cartList"])
  }
};
</script>

<style lan="less" scope>
.van-button--mini {
  min-width: 35px !important;
}
.van-submit-bar{
  bottom: 60px !important
}
</style>
