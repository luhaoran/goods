<template>
  <div style="padding-bottom:40px">
    <Navbar name="支付订单" />
    <div class="addordeWraper">
      <div class="addressWrap">
        <div class="address" v-if="address && address.name">
          <p>{{address.name}} {{address.tel}}</p>
          <p class="xxdz">{{address.address}}</p>
          <van-button plain color="#f69e2a" @click="$router.push('/selectaddress')" size="mini">重新选择</van-button>
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
            :price="item.countPrice"
            :desc="item.info"
            :title="item.name"
            :thumb="getZhutu(item)"
          >
            <div slot="tags">
              <van-tag plain type="primary">单价：￥{{item.price}}</van-tag>
            </div>
          </van-card>
        </div>
        <van-divider />
        <van-panel v-if="setting.outsidePrice" title="运费" :status="`+${setting.outsidePrice}元`" />
        <van-panel
          v-if="setting.firstOrderSale"
          title="立减"
          :status="`-${setting.firstOrderSale}元`"
        />
        <van-panel v-if="countMoLing.man" title="满减" :status="`-${countMoLing.jian}.00元`" />
        <van-coupon-cell
          title="商家代金券"
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          @click="showList = true"
        />
        <van-panel title="赠送代金券" :status="`${giveCouponNum} 张`" v-if="giveCouponNum>0" />
        <van-panel title="支付方式" status="微信支付" />
        <van-panel title="配送时间" :status="setting.outsideStartTime + '-' + setting.outsideEndTime" />
        <van-panel title="订单备注" status="填写备注 >" @click="remarkVisible = true" />
      </div>
      <van-submit-bar
        :loading="priceLoading"
        :price="orderPrice*100"
        button-text="支付"
        @submit="addOrderStep1"
      />
    </div>
    <van-popup v-model="showList" round position="bottom" style="height: 90%; padding-top: 4px;">
      <van-coupon-list
        :show-exchange-bar="false"
        :coupons="coupons"
        :disabled-coupons="disCoupons"
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
          placeholder="请输入备注"
          show-word-limit
          clearable
        />
        <van-button
          color="#f69e2a"
          style="margin-top:10px"
          @click="remarkVisible=false"
          round
          block
          size="small"
        >确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import { Dialog } from "vant";
import Navbar from "./Navbar";
export default {
  name: "Addorder",
  components: {
    Navbar
  },
  data() {
    return {
      searchValue: "",
      chosenCoupon: -1,
      showList: false,
      remark: "",
      remarkVisible: false,
      orderPrice: 0,
      priceLoading: true,
      countMoLing: { man: 0, jian: 0 },
      selCouponId: 0,
      giveCouponNum: 0,
      giveCoupon:{},
      coupons: [],
      disCoupons: [],
      selectCouponId: 0
    };
  },
  created() {},
  mounted() {
    this.getAddressList();
    this.getCoupon();
    setTimeout(() => {
      this.calcOrderPrice();
    }, 1000);
  },

  methods: {
    ...mapMutations(["settingSave"]),
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    getAddressList() {},
    //计算优惠券
    onChange(index) {
      this.calcOrderPrice();
      this.showList = false;
      this.chosenCoupon = index;
      this.selectCouponId = this.coupons[index].id;
      const price = this.coupons[index].value / 100;
      this.orderPrice -= price;
    },
    calcOrderPrice() {
      const setting = this.setting;

      let orderPrice = this.totalPrice;

      console.log("orderPrice " + orderPrice);
      //运费
      orderPrice =
        setting.outsidePrice > 0 &&
        orderPrice + parseFloat(setting.outsidePrice);
      console.log("orderPrice " + orderPrice);

      //首单立减
      orderPrice =
        setting.firstOrderSale > 0
          ? orderPrice - parseFloat(setting.firstOrderSale)
          : orderPrice;

      console.log("orderPrice " + orderPrice);
      //满减
      if (setting.countMoLing) {
        const countMoLing1 = setting.countMoLing.split(",");
        let countMoLing = countMoLing1.map(el => {
          const man = el.split("-")[0];
          const jian = el.split("-")[1];
          return { man, jian };
        });
        countMoLing.sort((a, b) => {
          return b.man - a.man;
        });
        countMoLing = countMoLing[0];
        this.countMoLing = countMoLing;
        orderPrice -= parseInt(countMoLing.jian);
      }

      this.orderPrice = orderPrice;
      this.priceLoading = false;

      //通过orderPrice获得可赠送优惠券数量
      this.getGiveCouponNum();
    },
    getGiveCouponNum() {
      const orderPrice = this.orderPrice;
      this.$axios
        .get(`/giveCouponNum?orderPrice=${orderPrice}`)
        .then(({ data }) => {
          this.giveCouponNum = data.num;
          this.giveCoupon = data.arr
          console.log(this.giveCoupon)
        });
    },
    //下单第一步，判断地址
    addOrderStep1() {
      if (!this.address.name)
        return Notify({ type: "warning", message: "请选择地址" });

      //如果有地址，先看商铺是否打开配送开关,再进行距离判断
      if (this.setting.outside > 0) {
        this.addOrderStep2();
      } else {
        this.addOrder();
      }
    },
    //进行距离判断
    addOrderStep2() {
      console.log("123123");
      const _this = this;
      const address = this.address;
      const { latitude: shopLat, longitude: shopLng } = this.setting;
      const outsideKm = parseFloat(this.setting.outsideKm) + 0.5;
      let sendAddress =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;
      sendAddress = sendAddress.replace(/\s*/g, "");
      this.$axios
        .get("/addressToGeo", { params: { address: sendAddress } })
        .then(({ data }) => {
          if (data.status === 0) {
            const lat = data.result.location.lat;
            const lng = data.result.location.lng;
            const distance = _this.GetDistance(lat, lng, shopLat, shopLng);
            if (distance > outsideKm) {
              Dialog.alert({
                title: "提示",
                message:
                  "很抱歉，您的收货地址超出了商户可配送的范围，无法为您下单"
              });
            } else {
              _this.addOrder();
            }
          } else {
            Dialog.alert({
              title: "提示",
              message: data.message
            });
          }
        });
    },
    GetDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = (lat1 * Math.PI) / 180.0;
      var radLat2 = (lat2 * Math.PI) / 180.0;
      var a = radLat1 - radLat2;
      var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      return s;
    },
    getCoupon() {
      let cartPro = this.cartList.map(item => {
        return {
          id: item.id,
          count: item.selNum * parseFloat(item.price)
        };
      });
      cartPro = JSON.stringify(cartPro);
      const user = this.user;
      this.$axios
        .get("/getCoupon", { params: { cartPro, user: user } })
        .then(({ data }) => {
          if (data.status === 1) {
            let coupons = [];
            let disCoupons = [];
            data.arr.forEach(item => {
              const condition =
                parseFloat(item.info.orderPrice) > 0
                  ? `满${item.info.orderPrice}可用`
                  : "无门槛券";
              const obj = {
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
              item.yes ? coupons.push(obj) : disCoupons.push(obj);
            });
            this.coupons = coupons;
            this.disCoupons = disCoupons;
          }
        });
    },
    addOrder() {
      const _this = this
      const order = {
        cartList: this.cartList,
        orderPrice: this.orderPrice,
        cartPrice: this.totalPrice,
        address: this.address,
        noteValue: this.remark,
        selCouponId: this.selectCouponId,
        outsidePrice: this.setting.outsidePrice
      };
      const sender = {
        type: "order",
        order,
        user: { id: "536", code: "e2ed2e34332c39483cba6b42d496605bd7bdc8e5" }
      };
      console.log(JSON.stringify(sender));
      this.$axios.post("/wxpay", JSON.stringify(sender)).then(({ data }) => {
        if (data.status === 1) {
          _this.gotoWechatPay(data.arr,data.order);
        }else{
          return Notify({ type: 'danger', message: '下单失败，请稍后再试!' });
        }
      });
      // this.gotoWechatPay(order);
    },
    gotoWechatPay(data,order) {
      var vm = this;
      if (typeof WeixinJSBridge == "undefined") {
        //微信浏览器内置对象。参考微信官方文档
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            vm.onBridgeReady(data),
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", vm.onBridgeReady(data,order));
          document.attachEvent("onWeixinJSBridgeReady", vm.onBridgeReady(data,order));
        }
      } else {
        vm.onBridgeReady(data,order);
      }
    },
    onBridgeReady(data,order) {
      const _this = this
      window.WeixinJSBridge.invoke("getBrandWCPayRequest", data, function(res) {
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
          const giveCoupon = JSON.stringify(_this.giveCoupon)
          this.$router.push(`/return?action=success&id=${order.id}&coupon=${giveCoupon}&orderNO=${order.orderNO}`)
        }else{
          this.$router.push(`/return?action=fail&id=${order.id}`)
        }
        
      });
    }
  },
  computed: {
    ...mapState([
      "setting",
      "cartList",
      "cartNums",
      "domain",
      "address",
      "totalPrice",
      "user"
    ])
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
.remarkPop {
  margin: 50px 20px 30px 20px;
  .van-field {
    border: 1px solid #eeeeee;
    border-radius: 5px;
  }
}
.van-submit-bar {
  bottom: 50px !important;
}
</style>
