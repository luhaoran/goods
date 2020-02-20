<template>
  <div class="userWrap">
    <div class="bg"></div>
    <template v-if="action=='success'">
      <div class="result">
        <h4>付款成功</h4>
        <p class="info">感谢您对{{setting.name}}的支持，欢迎再次光临</p>
      </div>
      <div class="giveCoupon">
        <div class="couponList" v-if="coupon">
          <h5 class="congratulations">恭喜您获得商家代金券{{coupon.length}}张</h5>
          <div v-for="item in coupon" :key="JSON.stringify(item)" class="item">
            <div class="couponWrap">
              <div class="money">
                <h2>￥{{item.price}}</h2>
                <p>满{{item.orderPrice}}元可用</p>
              </div>
              <div class="info">
                <h4>{{item.title}}</h4>
                <p>有效期至{{item.expiryTime}}</p>
              </div>
            </div>
            <van-divider />
            <div class="proName">仅限以下商品可用：{{item.proName}}</div>
          </div>
        </div>
        <div class="jump">
          <h5>订单详情、代金券、物流中心</h5>
          <p>请在首页个人中心查看</p>
          <van-button
            class="btn"
            color="#5675f2"
            round
            size="small"
            @click="$router.push('/user')"
          >点击跳转</van-button>
        </div>
      </div>
    </template>
    <template v-if="action=='fail'">
      <div class="result fail">
        <h4>订单支付失败</h4>
        <p class="info">{{error}}</p>
      </div>
      <div class="repay">
        <p>您可以选择重新支付</p>
        <van-button class="btn" color="#f7444b" round @click="$router.go(-1)">重新支付</van-button>
        <p>或者</p>
        <van-button class="btn btn2" color="#fff" round @click="$router.push('/')">返回首页</van-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Eachorder",
  components: {},
  data() {
    return {
      action: "fail",
      id: 0,
      coupon: [],
      error: ""
    };
  },
  created() {},
  mounted() {
    const { action, id, coupon, error } = this.$route.query;
    this.action = action;
    this.id = id;
    this.coupon = coupon && JSON.parse(coupon);
    if (this.coupon && this.coupon.length > 0) {
      this.redTipSave([1, 0, 1, 0]);
    } else {
      this.redTipSave([1, 0, 0, 0]);
    }
    this.error = error;
  },

  methods: {
    ...mapMutations(["redTipSave"])
  },
  computed: {
    ...mapState(["user", "setting"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.result {
  background-color: #5675f2;
  text-align: center;
  color: #fff;
  padding: 40px 0;
  h4 {
    font-size: 19px;
    margin: 0;
    font-weight: normal;
  }
  .info {
    margin-top: 20px;
    font-size: 14px;
  }
}
.result.fail {
  background-color: #f7444b;
}
.couponList {
  margin: 20px 2.5%;
  .congratulations {
    text-align: center;
    font-size: 16px;
    color: red;
    font-weight: normal;
  }
  .item {
    background-color: #fff;
    padding: 15px;
    border-radius: 5px;
    .couponWrap {
      display: flex;
      padding: 10px 0 15px 0;
      .money {
        text-align: center;
        margin-right: 18px;
        h2 {
          color: #ff0000;
          font-size: 20px;
          margin: 0;
        }
        p {
          font-size: 12px;
          color: #777;
        }
      }
      .info {
        h4 {
          font-size: 16px;
          color: #333;
          font-weight: normal;
          margin: 0;
          margin: 2px 0 3px 0;
        }
        p {
          font-size: 12px;
          color: #777;
        }
      }
    }
    .proName {
      margin-top: 8px;
      font-size: 12px;
      color: #777;
    }
  }
}
.jump {
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  text-align: center;
  padding: 13px 0;
  h5 {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
  }
  p {
    font-size: 12px;
    margin: 7px 0;
    color: #999;
  }
  .btn {
    padding: 0 20px;
  }
}
.repay {
  text-align: center;
  margin-top: 100px;
  p {
    font-size: 14px;
    color: #666;
  }
  .btn {
    padding: 0 25px;
    margin: 10px 0;
    height: 36px;
    line-height: 36px;
  }
  .btn2 {
    color: #333 !important;
  }
}
</style>
