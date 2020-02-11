<template>
  <div>
    <Navbar name="首页" />
    <swiper ref="mySwiper" style="height: auto">
      <!-- slides -->
      <swiper-slide v-for="item in banner" :key="item.pic">
        <img :src="domain + item.pic" alt />
      </swiper-slide>
    </swiper>
    <div class="switchItem">
      <van-dropdown-menu>
        <van-dropdown-item v-model="nowIndex" :options="category" :title="nowName" />
      </van-dropdown-menu>
      <div class="sortWrap">
        <span>
          价格
          <van-icon name="arrow-down" />
        </span>
        <span>
          销量
          <van-icon name="arrow-down" />
        </span>
        <span>
          名称
          <van-icon name="arrow-down" />
        </span>
      </div>
    </div>
    <div class="productList">
      <div class="productItem" v-for="item in nowProducts" :key="JSON.stringify(item)">
        <van-image
          @click="showDetail(item)"
          width="100%"
          height="190"
          fit="contain"
          :src="getZhutu(item)"
        />
        <div class="text">
          <p class="title">{{item.name}} {{item.unit}}</p>
          <p class="note">{{item.info}}</p>
          <div class="priceAndNums">
            <p class="price">￥{{item.price}}</p>
            <div class="numbers" v-if="item.num > 0">
              <template v-if="item.selNum > 0">
                <i class="basecolor iconfont icon-icon_roundreduce_fil" @click="numRed(item)"></i>
                <span>{{item.selNum}}</span>
              </template>
              <i class="basecolor iconfont icon-icon_roundadd_fill" @click="numAdd(item)"></i>
            </div>
            <van-tag v-else>已售罄</van-tag>
          </div>
        </div>
      </div>
    </div>

    <van-popup
      v-model="showDetailVisible"
      round
      position="bottom"
      :style="{ height: '94%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="detailModal">
        <swiper ref="mySwiper" style="height: 350px">
          <!-- slides -->
          <swiper-slide v-for="item in nowProduct.pics" :key="item">
            <van-image width="100%" height="100%" fit="contain" :src="domain + item" />
          </swiper-slide>
        </swiper>
        <div class="text detailText">
          <p class="title"><span>{{nowProduct.name}}</span> {{nowProduct.unit}}</p>
          <p class="note">{{nowProduct.info}}</p>
          <div class="priceAndNums">
            <p class="price">￥{{nowProduct.price}}</p>
            <div class="numbers" v-if="nowProduct.num > 0">
              <template v-if="nowProduct.selNum > 0">
                <i class="basecolor iconfont icon-icon_roundreduce_fil" @click="numRed(nowProduct)"></i>
                <span>{{nowProduct.selNum}}</span>
              </template>
              <i class="basecolor iconfont icon-icon_roundadd_fill" @click="numAdd(nowProduct)"></i>
            </div>
            <van-tag v-else>已售罄</van-tag>
          </div>
        </div>
        <div class="detailDetail">
            <h3>物品详情</h3>
            <div v-html="formatContent(nowProduct.content)"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Notify } from "vant";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapState, mapMutations } from "vuex";
import Navbar from "./Navbar";

export default {
  name: "Home",
  components: {
    swiper,
    swiperSlide,
    Navbar
  },
  data() {
    return {
      banner: [],
      category: [],
      nowIndex: 0,
      nowName: "商品分类",
      nowProducts: [],
      showDetailVisible: false,
      nowProduct: {}
    };
  },
  created() {
    this.getBanner();
    this.getCategory();
  },
  mounted() {
    this.swiper.slideTo(3, 1000, false);
  },
  methods: {
    ...mapMutations(["cartListSave", "cartNumsAdd", "cartNumsRed"]),
    getBanner() {
      this.$axios.get("/getBanner").then(res => {
        const { data } = res;
        if (data.status !== 1)
          return Notify({ type: "danger", message: "banner获取失败!" });
        this.banner = data.arr;
      });
    },
    getCategory() {
      const { cartList } = this.$store.state;
      this.$axios.get("/getCategory").then(res => {
        const { data } = res;
        if (data.status !== 1)
          return Notify({ type: "danger", message: "category获取失败!" });
        let arr = data.arr;
        arr.forEach((item, index) => {
          item.text = item.name;
          item.value = index;
          item.pro.forEach(el => {
            const has = cartList.find(ct => ct.id == el.id);
            if (has) {
              el.selNum = has.selNum;
            } else {
              el.selNum = 0;
            }
          });
        });
        this.category = arr;
        this.nowProducts = arr[0].pro;
        this.nowProduct = arr[0].pro[0];
      });
    },
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.zhutu.split(",");
      return this.domain + pic;
    },
    numAdd(item) {
      item.selNum += 1;
      let cartList = this.cartList;
      const has = cartList.findIndex(el => el.id == item.id);
      if (has >= 0) {
        cartList.splice(has, 1, item);
      } else {
        cartList.push(item);
      }
      this.cartNumsAdd();
      let category = this.category;
      category[this.nowIndex].pro = this.nowProducts;
      this.category = category;
      this.cartListSave(cartList);
    },
    numRed(item) {
      let cartList = this.cartList;
      const has = cartList.findIndex(el => el.id == item.id);
      if (item.selNum > 0) {
        item.selNum -= 1;
        cartList.splice(has, 1, item);
        this.cartNumsRed();
      }
      if (item.selNum === 0) cartList.splice(has, 1);
      let category = this.category;
      category[this.nowIndex].pro = this.nowProducts;
      this.category = category;
      this.cartListSave(cartList);
    },
    showDetail(item) {
      let pro = item;
      pro.pics = item.pic.split(",");
      this.nowProduct = pro;
      this.showDetailVisible = true;
    },
    formatContent(content){
        //var mycontent = content.replace(/\<img/gi, '<img class="contentImg"');
        if (content.indexOf(this.domain) < 0) {
            content = content.replace(/\/Public/gi, this.domain + '/Public');
        }
        return content
    },
  },
  computed: {
    ...mapState(["domain", "cartList", "cartNums"]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  watch: {
    nowIndex() {
      this.nowName = this.category[this.nowIndex].name;
      this.nowProducts = this.category[this.nowIndex].pro;
    }
  }
};
</script>

<style lang="less" scope>
@borderCorle: #efefef;
@baseColor:#f69e2a;
.basecolor {color: @baseColor}
.swiper-slide {
  img {
    max-width: 100%;
  }
}
.switchItem {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid @borderCorle !important;
  border-bottom: 1px solid @borderCorle !important;
}
.van-dropdown-menu {
  height: 40px !important;
  width: 23%;
  border: none !important;
  border-right: 1px solid @borderCorle !important;
  padding-right: 10px;
}
.van-dropdown-menu__title {
  font-size: 14px !important;
}
.sortWrap {
  font-size: 13px;
  display: flex;
  align-items: center;
  span {
    margin-right: 8px;
    i {
      top: 2px;
      position: relative;
    }
  }
}
.productList {
  background: #f1f2f3;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 2% 0;
  .productItem {
    width: 45.5%;
    background-color: #fff;
    margin-bottom: 2%;
    padding-bottom: 1.5%;
  }
  &:after {
    content: "";
    width: 45.5%;
    height: 0;
    display: block;
  }
}
.text {
    padding: 0 5% 2% 5%;
    .title {
    font-size: 13px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    }
    .note {
    font-size: 11px;
    color: #777;
    padding: 5px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    }
    .price {
    font-size: 16px;
    color: #f69e2a;
    font-weight: 700;
    }
}
.text.detailText{
    margin-top: 15px;
    .title{
        span{
            font-size: 18px;
            font-weight: bold
        }
    }
}
.priceAndNums{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .numbers{
        display: flex;
        align-items: center;
        justify-content: space-around;
        span{
            font-size: 15px;
            margin: 0 5px;
            color: #666
        }
        i{
            font-size: 18px;
            opacity: .6;
        }
    }
}
.detailModal{
    margin: 50px 0 20px 0;
}
.detailDetail{
    border-top: 10px solid #eee;
    padding: 0 20px;
    img{
        max-width: 100%;
    }
}
</style>
