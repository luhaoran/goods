<template>
  <div style="padding-bottom:50px">
    <router-view></router-view>
    <van-tabbar v-model="activeFooter" active-color="#ff9813">
      <!-- <van-tabbar-item  v-for="(item,index) in footer" :key="item.icon" replace :to="item.to" :info="index == 2 ? cartNums : false">
        <span>{{item.name}}</span>
        <img slot="icon" :src="item.icon" />
      </van-tabbar-item> -->
      <van-tabbar-item  v-for="item in footer" :key="item.icon" replace :to="item.to" >
        <span>{{item.name}}</span>
        <img slot="icon" :src="item.icon" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
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
          name: "主页",
          to:'/'
        },
        {
          icon: require("../..//public/images/md2-ft-2.png"),
          name: "搜索",
          to:'/search'
        },
        {
          icon: require("../..//public/images/md2-ft-3.png"),
          name: "购物车",
          to:'cartlist'
        },
        {
          icon: require("../..//public/images/md2-ft-4.png"),
          name: "我的",
          to:'/user'
        }
      ],
      activeFooter:0,
      nums:0
    };
  },
  created() {
    const { shopCode } = this.$store.state; //在store获取shopCode
    if (!shopCode) {
      return Notify({ type: "danger", message: "shopCode设置错误!" });
    }
    this.getSetting();
  },
  mounted() {
    const nowPath = this.$route.path;
    switch(nowPath){
      case '/home':
        this.activeFooter = 0;
        break;
      case '/serach':
        this.activeFooter = 1;
        break;
      case '/cartlist':
        this.activeFooter = 2;
        break;
      case '/user':
        this.activeFooter = 3;
        break;
    }
  },

  methods: {
    ...mapMutations(["settingSave"]),
    getSetting() {
      this.$axios.get("/getSetting").then(res => {
        const { data } = res;
        this.settingSave(data.arr);
      });
    },

  },
  computed: {
    ...mapState(["setting","cartList","cartNums"])
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

<style>
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
.van-nav-bar__title.van-ellipsis{
  font-size: 14px
}
.van-icon-arrow-left::before{
  color: #323233
}

</style>
