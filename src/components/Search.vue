<template>
  <div>
    <Navbar name="搜索" />
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="search" />
    <template v-if="result.length > 0 && startSearch">
      <van-card
        v-for="item in result"
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
    <div v-else-if="startSearch" class="searchNoPros">
      <h5>并未搜索到相关产品</h5>
    </div>
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Search",
  components: {
    Navbar
  },
  data() {
    return {
      searchValue: "",
      result: [],
      startSearch: false
    };
  },
  created() {},
  mounted() {},

  methods: {
    ...mapMutations(["cartListSave"]),
    search() {
      const searchValue = this.searchValue;
      this.$axios
        .get(`/searchPros`, {
          params: {
            searchValue,
            user: JSON.stringify(this.user)
          }
        })
        .then(res => {
          const { data } = res;
          //将cartlist值付给返回数据
          if (data && data.length > 0) {
            data.forEach(item => {
              item.selNum = 0;
              const has = this.cartList.find(el => item.id == el.id);
              if (has) item.selNum = has.selNum;
            });
          }
          this.result = data;
          this.startSearch = true;
        });
    },
    numAdd(item) {
      const cartList = this.cartList;
      item.selNum += 1;
      if (item.selNum == 1) {
        cartList.push(item);
      } else {
        const has = cartList.findIndex(el => el.id == item.id);
        cartList.splice(has, 1, item);
      }

      this.cartListSave(cartList);
    },
    numRed(item) {
      const cartList = this.cartList;

      if (item.selNum > 0) {
        if (item.selNum == 1) {
          item.selNum -= 1;
          let cartList = this.cartList;
          const has = cartList.findIndex(el => el.id == item.id);
          cartList.splice(has, 1);
        } else {
          item.selNum -= 1;
          const has = cartList.findIndex(el => el.id == item.id);
          cartList.splice(has, 1, item);
        }
        this.cartListSave(cartList);
      }
    },
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    }
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums", "user", "domain"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.searchNoPros {
  text-align: center;
  color: #777;
}
</style>
