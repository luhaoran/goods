<template>
  <div style="padding-bottom:50px;" :class="setting.modeType == 1 ? 'outsideWrap' : ''">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <van-tabbar v-model="activeFooter" active-color="#ff9813">
      <van-tabbar-item  v-for="(item,index) in footer" :key="item.icon" replace :to="item.to" :info="index == 2 ? cartNums : false">
        <span>{{item.name}}</span>
        <img slot="icon" :src="item.icon" />
      </van-tabbar-item>
      <!-- <van-tabbar-item v-for="item in footer" :key="item.icon" replace :to="item.to">
        <span>{{item.name}}</span>
        <img slot="icon" :src="item.icon" />
      </van-tabbar-item> -->
      <van-overlay :show="showNotWechat" class="isNotWechat">
        <div class="wrapper" @click.stop>
          <h3>请在微信客户端打开本页面</h3>
        </div>
      </van-overlay>
    </van-tabbar>
  </div>
</template>

<script>
import qq from "qq";
import { Dialog } from "vant";
import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Index",
  components: {},
  data() {
    return {
      footer: [
        {
          icon: require("../..//public/images/md2-ft-1.png"),
          name: "首页",
          to: "/"
        },
        {
          icon: require("../..//public/images/md2-ft-2.png"),
          name: "搜索",
          to: "/search"
        },
        {
          icon: require("../..//public/images/md2-ft-3.png"),
          name: "购物车",
          to: "/cartlist"
        },
        {
          icon: require("../..//public/images/md2-ft-4.png"),
          name: "我的",
          to: "/user"
        }
      ],
      activeFooter: 0,
      nums: 0,
      showNotWechat:false
    };
  },
  created() {
    // this.checkIsWechat();
    const { shopCode } = this.$store.state; //在store获取shopCode
    if (!shopCode) {
      return Notify({ type: "danger", message: "shopCode设置错误!" });
    }
    this.getSetting();
  },
  mounted() {
    const nowPath = this.$route.path;
    switch (nowPath) {
      case "/home":
        this.activeFooter = 0;
        break;
      case "/serach":
        this.activeFooter = 1;
        break;
      case "/cartlist":
        this.activeFooter = 2;
        break;
      case "/user":
        this.activeFooter = 3;
        break;
    }
    this.calcCartListNum();
  },

  methods: {
    ...mapMutations(["settingSave", "cartNumsSave", "totalPriceSave"]),
    //判断是否是微信内置浏览器
    checkIsWechat() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) != "micromessenger") {
        //如果不是则显示错误
        this.showNotWechat = true
      }
    },
    getSetting() {
      this.$axios.get("/getSetting").then(res => {
        const { data } = res;
        if (data.arr.open != "1") {
          this.$router.push("/close");
        }
        this.settingSave(data.arr);
        data.arr.outside > 0 && this.calcDistance();
      });
    },
    calcDistance() {
      const _this = this;
      const { latitude: shopLat, longitude: shopLng } = this.setting;
      const outsideKm = parseFloat(this.setting.outsideKm) + 0.5;
      var geolocation = new qq.maps.Geolocation(
        "S6HBZ-4CSCX-XP74J-7TIBY-CAZXE-QKF6E",
        "good"
      );
      geolocation.getLocation(
        ({ lat, lng }) => {
          console.log(lat, lng);
          const distance = _this.GetDistance(lat, lng, shopLat, shopLng);
          console.log("distance " + distance);
          console.log("outsideKm " + outsideKm);
          if (distance > outsideKm) {
            Dialog.alert({
              title: "提示",
              message: "由于您当前的位置超出了商户可配送的范围，请谨慎下单"
            });
          }
        },
        error => {
          console.log(error);
        },
        { timeout: 8000 }
      );
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
    calcCartListNum() {
      let cartNums = 0;
      let totalPrice = 0.0;
      this.cartList.forEach(el => {
        cartNums += el.selNum;
        totalPrice += el.selNum * parseFloat(el.price);
      });
      this.cartNumsSave(cartNums);
      this.totalPriceSave(totalPrice);
    }
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums"])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.currentRouter = route.name;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less">
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
#app {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
p {
  margin: 0;
}
.van-nav-bar__title.van-ellipsis {
  font-size: 14px;
}
.van-icon-arrow-left::before {
  color: #323233;
}
.noCartListDiv {
  text-align: center;
  padding-top: 50px;
  font-size: 14px;
  color: #999;
  .iconfont {
    font-size: 30px;
  }
  p {
    margin-top: 10px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.van-divider {
  margin: 0 !important;
}
.isNotWechat{
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  h3{
    font-weight: normal
  }
}
</style>
