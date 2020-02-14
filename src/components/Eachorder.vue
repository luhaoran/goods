<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="订单详情" />
    <div class="orderItem">
      <div class="orderHeader">
        <p>{{order.payTime}}</p>
        <span>{{order.stateInfo}}</span>
      </div>
      <van-card
        :num="item.selNum"
        :price="item.count"
        :desc="item.info.info"
        :title="item.info.name"
        :thumb="getZhutu(item.info)"
        v-for="item in order.products"
        :key="JSON.stringify(item)"
      >
        <div slot="tags">
          <van-tag plain type="primary">单价：￥{{item.price}}</van-tag>
        </div>
      </van-card>
      <div class="orderPayment">
        <p>实付￥{{order.payment}}</p>
        <span>(优惠￥{{order.salePrice}})</span>
      </div>
    </div>
    <div class="orderItem express" v-if="order.expressId">
      <div class="orderHeader">
        <p>物流详情</p>
      </div>
      <van-divider />
      <div class="expressInfo">
        <div class="expressItem">
          <span class="tit">发货时间</span>
          <p>{{order.expressTime}}</p>
        </div>
        <div class="expressItem">
          <span class="tit">收货信息</span>
          <p>{{order.address.provinceName + order.address.cityName + order.address.countyName + order.address.detailInfo}}</p>
        </div>
        <div class="expressItem">
          <span class="tit">配送物流</span>
          <p>{{order.expressName}}</p>
        </div>
        <div class="expressItem">
          <span class="tit">联系电话</span>
          <p>{{order.expressPhone}}</p>
        </div>
        <div class="expressItem">
          <span class="tit">物流订单</span>
          <p @click="copyaa" data-clipboard-target="#expressNum" class="expressBtn">
            <i class="iconfont icon-fuzhi"></i>
            <span id="expressNum">{{order.expressNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="orderBtnGroup">
        <button @click="$router.push(`/Orderquit?id=${order.id}`)">申请退款</button>
        <button @click="$router.push(`/orderscore?id=${order.id}`)">订单评价</button>
        <button @click="$router.push('/user')">联系商家</button>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapState } from "vuex";
import Navbar from "./Navbar";
import ClipboardJS from "clipboard";
export default {
  name: "Eachorder",
  components: {
    Navbar
  },
  data() {
    return {
      id: 0,
      order: {}
    };
  },
  created() {},
  mounted() {
    this.getOrderInfo(this.$route.query.id);
  },

  methods: {
    getOrderInfo(id) {
      if (!id) return;
      const user = this.user;
      this.$axios
        .get("/getOrder", { params: { user, id } })
        .then(({ data }) => {
          if (data.status === 1) {
            this.order = data.arr;
          }
        });
    },
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    copyaa() {
      var clipboard = new ClipboardJS(".expressBtn");
      clipboard.on("success", function(e) {
        if (e.text) {
          Notify({ type: "success", message: "订单号复制成功!" });
        }
        e.clearSelection();
      });

      clipboard.on("error", function(e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
      });
    }
  },
  computed: {
    ...mapState(["user", "domain"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.expressInfo {
  padding: 10px 14px;
  background: #fff;
  border-top: 1px #eee solid;
  overflow: hidden;
  .expressItem {
    font-size: 14px;
    padding: 7.5px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tit {
      color: #333;
    }
    p {
      max-width: 70%;
      text-align: right;
      i {
        margin-right: 2px;
      }
    }
  }
}
.express .orderHeader{
  padding-bottom: 10px
}
.orderBtnGroup{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin: 0 auto;
    background: #fff;
    border-radius:5px;
    padding: 10px 0;
    button{
        padding:7.5px 10px;font-size:14px;
        background: #f8f8f8;
        border: none;
        margin: 0 10px;
        border-radius: 5px;
        color: #333
    }
}

</style>
