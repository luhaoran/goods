<template>
  <div style="padding-bottom:40px">
    <Navbar name="支付订单" />
    <div class="addordeWraper">
      <div class="addressWrap">
        <div class="address" v-if="address && address.name">
          <p>{{address.name}} {{address.tel}}</p>
          <p class="xxdz">{{address.address}}</p>
        </div>
        <van-button
          class="selectAddressBtn"
          round
          block
          color="linear-gradient(to right, #f3d5ae, #FF9813)"
          @click="$router.push('/Selectaddress')"
          v-else
        >选择地址</van-button>
      </div>
      <div class="orderInfo">
        <h4>订单详情</h4>
        <van-divider />
        <div class="orderCartList">
          <van-card
            v-for="item in cartList"
            :key="JSON.stringify(item)"
            :num="item.selNum"
            :price="item.price"
            :desc="item.info"
            :title="item.name"
            :thumb="getZhutu(item)"
          ></van-card>
        </div>
        <van-divider />
        <van-coupon-cell
          title="商家代金券"
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          @click="showList = true"
        />
        <van-panel title="支付方式" status="微信支付" />
        <van-panel title="配送时间" :status="setting.outsideStartTime + '-' + setting.outsideEndTime" />
        <van-panel title="订单备注" status="填写备注 >" @click="remarkVisible = true" />
      </div>
      <van-submit-bar :price="totalPrice" button-text="支付" @submit="addOrder" />
    </div>
    <van-popup v-model="showList" round position="bottom" style="height: 90%; padding-top: 4px;">
      <van-coupon-list
        :show-exchange-bar="false"
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        @change="onChange"
      />
    </van-popup>
    <van-popup v-model="remarkVisible" round position="bottom" closeable :style="{ height: '36%' }">
      <div class="remarkPop">
        <van-field
        v-model="remark"
        rows="3"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
        clearable
      />
        <van-button color="#f69e2a" style="margin-top:10px" @click="remarkVisible=false" round block size="small">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Addorder",
  components: {
    Navbar
  },
  data() {
    return {
      searchValue: "",
      coupons: [
        {
          available: 1,
          condition: "无使用门槛\n最多优惠12元",
          reason: "",
          value: 150,
          name: "优惠券名称",
          startAt: 1489104000,
          endAt: 1514592000,
          valueDesc: "1.5",
          unitDesc: "元"
        }
      ],
      chosenCoupon: -1,
      showList: false,
      remark: "",
      remarkVisible: false,
      totalPrice:0.00
    };
  },
  created() {},
  mounted() {
    this.getAddressList();
    this.calcTotalPrice();
  },

  methods: {
    ...mapMutations(["settingSave"]),
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    getAddressList() {},
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    calcTotalPrice() {
      const cartList = this.cartList;
      let totalPrice = 0;
      cartList.forEach(el => {
        let total = parseFloat(el.price) * el.selNum;
        totalPrice += total;
        console.log(total, totalPrice);
      });
      this.totalPrice = totalPrice * 100;
    },
    addOrder(){
      Notify({ type: 'warning', message: '支付中，请稍后...' });
    }
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums", "domain", "address"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.addordeWraper {
  background: #e7e7e7;
  padding-bottom: 20px;
}
.addressWrap {
  background: #fff;
  padding: 16px 20px;
}
.selectAddressBtn {
  margin: 20px 0;
}
.address {
  background: #fff;
  line-height: 22px;
  padding: 20px 0;
  font-size: 18px;
  color: #f69e2a;
  .xxdz {
    font-size: 14px;
  }
}
.orderInfo {
  margin: 14px 8px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  h4 {
    padding: 0 12px;
    margin: 16px 0;
  }
  .orderCartList {
    margin: 16px 0;
    padding: 0 12px;
  }
}
.remarkPop{
  margin: 50px 20px 30px 20px;
  .van-field{
    border: 1px solid #eeeeee;
    border-radius: 5px
  }
}
.van-submit-bar {
  bottom: 50px !important;
}
</style>
