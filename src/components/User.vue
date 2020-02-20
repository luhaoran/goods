<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="我的" />
    <div class="userInfo">
      <div>
        <van-image round width="80" height="80" src>
          <template v-slot:error>
            <i class="avatarr iconfont icon-icon_patriarch"></i>
          </template>
        </van-image>
        <p class="username">{{userInfo.nickName}}</p>
        <p class="level">- 普通用户 -</p>
      </div>
    </div>
    <van-row type="flex" justify="space-around" class="menu">
      <van-col
        span="5"
        class="menuItem"
        v-for="(item,index) in menus"
        @click="goto(item.to)"
        :key="JSON.stringify(item)"
      >
        <van-image round width="50" height="50" src dot>
          <template v-slot:error>
            <i class="menuIcon iconfont" :class="item.icon"></i>
          </template>
        </van-image>
        <span v-if="redTip[index]" class="dot"></span>
        <p>{{item.name}}</p>
      </van-col>
    </van-row>
    <div class="func">
      <div class="funcItem">
        <a href="tel:13888888888" class="tel">
          <i class="iconfont icon-dianhua"></i>
          <span>联系商户</span>
        </a>
      </div>
      <van-divider />
      <div class="funcItem">
        <i class="iconfont icon-zuobiao"></i>
        <span>商户位置查看</span>
      </div>
      <div class="funcItem" @click="removeStorage">
        <i class="iconfont icon-weixin"></i>
        <span>清除缓存</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "User",
  components: {
    Navbar
  },
  data() {
    return {
      menus: [
        {
          name: "订单",
          icon: "icon-dingdan",
          to: "/order",
          enName: "order"
        },
        {
          name: "统计",
          icon: "icon-tuiguangtongji",
          to: "/count"
        },
        {
          name: "券包",
          icon: "icon-youhuiquan",
          to: "/coupon",
          enName: "coupon"
        },
        {
          name: "反馈",
          icon: "icon-fankui",
          to: "/feedback"
        }
      ],
      saveCoupon: []
    };
  },
  created() {},
  mounted() {
    console.log(this.redTip);
  },

  methods: {
    goto(url) {
      this.$router.push(url);
    },
    removeStorage() {
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
    }
  },
  computed: {
    ...mapState(["user", "userInfo", "redTip"])
  },
  watch: {}
};
</script>

<style lang="less" >
.userWrap {
  height: 100%;
  color: #666;
}
.userInfo {
  background: #fff;
  padding: 20px 0 28px 0;
  display: flex;
  justify-content: center;
  text-align: center;
  .username {
    margin: 8px 0 5px 0;
  }
  .level {
    font-size: 12px;
    color: #888;
  }
}
.bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 999px;
  z-index: -1;
  background: #e7e7e7;
}
.avatarr {
  font-size: 36px;
}
.menu {
  margin-top: 15px;
  background: #fff;
  padding: 20px 0;
  .menuItem {
    text-align: center;
    position: relative;
    .menuIcon {
      color: #888;
      font-size: 31px;
    }
    p {
      font-size: 13px;
    }
  }
}
.func {
  background-color: #fff;
  margin-top: 15px;
  .funcItem {
    padding: 12.5px 15px;
    display: flex;
    align-items: center;
    i {
      font-size: 20px;
    }
    span {
      display: block;
      margin-left: 8px;
      font-size: 14px;
    }
    .tel {
      display: flex;
      align-items: center;
      color: inherit;
    }
  }
}
.dot {
  width: 10px;
  height: 10px;
  display: block;
  background: #fb7474;
  position: absolute;
  right: 12.5px;
  top: -2.5px;
  border-radius: 50px;
  border: 2px #fff solid;
}
</style>
