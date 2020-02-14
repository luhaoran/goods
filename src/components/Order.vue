<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="订单" />
    <div class="orderItem" v-for="item in list" :key="JSON.stringify(item)">
      <div class="orderHeader">
        <p>{{item.payTime}}</p>
        <span>{{item.stateInfo}}</span>
      </div>
      <van-card
        :num="item.showProduct.selNum"
        :price="item.showProduct.count"
        :desc="item.showProduct.info.info"
        :title="item.showProduct.info.name"
        :thumb="getZhutu(item.showProduct.info)"
      >
        <div slot="tags">
          <van-tag plain type="primary">单价：￥{{item.showProduct.price}}</van-tag>
        </div>
      </van-card>
      <div class="orderPayment">
        <p>实付￥{{item.payment}}</p>
        <span>(优惠￥{{item.salePrice}})</span>
      </div>
      <div class="orderSeeMore" @click="$router.push(`/eachorder?id=${item.id}`)">点击查看全部</div>
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <template slot="no-more">没有更多订单啦</template>
    </infinite-loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./Navbar";
import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "Order",
  components: {
    Navbar,
    InfiniteLoading
  },
  data() {
    return {
      list: [],
      page: 1
    };
  },
  created() {},
  mounted() {},

  methods: {
    infiniteHandler($state) {
      const user = this.user;
      this.$axios
        .get("/getOrderList", {
          params: {
            pageFt: this.page,
            user
          }
        })
        .then(({ data }) => {
          if (data.arr && data.arr.length) {
            this.page += 1;
            let list = data.arr;
            list.forEach(el => {
              el.showProduct = el.products[0];
            });

            this.list.push(...list);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    }
  },
  computed: {
    ...mapState(["user", "domain"])
  },
  watch: {}
};
</script>

<style lang="less" >
.orderItem {
  width: 95%;
  margin: 15px auto;
  border-radius: 5px;
  box-shadow: 0 0 10px #ddd;
  overflow: hidden;
  background: #fff;
  .orderHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px 0 15px;
    font-size: 12px;
    color: #999;

    span {
      font-weight: bold;
      color: #333;
    }
  }
  .orderPayment {
    display: flex;
    justify-content: flex-end;
    background: #fff;
    padding: 10px;
    font-size: 12px;
    align-items: center;
    color: #999;
    p {
      font-size: 15px;
      margin-right: 5px;
      color: #333;
    }
  }
  .orderSeeMore {
    background: #f69e2a;
    color: #fff;
    padding: 10px 15px;
    line-height: 1;
    font-size: 13px;
    text-align: center;
    opacity: .8;
  }
}
</style>
