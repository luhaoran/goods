<template>
  <div style="height:100%">
    <Navbar name="首页" />
    <van-notice-bar
      v-if="showNotice"
      :text="notice.content"
      left-icon="volume-o"
      mode="link"
      @click="gotoArticle(notice.id)"
    />
    <swiper ref="mySwiper" style="height: 120px">
      <!-- slides -->
      <swiper-slide v-for="item in banner" :key="item.pic">
        <van-image width="100%" height="120px" :src="domain + item.pic" fit="cover" />
      </swiper-slide>
    </swiper>
    <template v-if="setting.modeType == 2">
      <van-sticky>
        <div class="switchItem">
          <van-dropdown-menu>
            <van-dropdown-item v-model="nowIndexb" :options="category" :title="nowName" />
          </van-dropdown-menu>
          <div class="youhui" v-if="youhui.length" @click="showYouhuiVisible=true">
            <van-tag plain type="warning">{{youhui[0]}}</van-tag>
            <van-tag plain type="warning">更多优惠</van-tag>
          </div>
          <div class="sortWrap">
            <span
              v-for="(item,index) in sortConfig"
              :key="JSON.stringify(item)"
              :class="[item.active&&'active']"
              @click="sort(index)"
            >
              {{item.name}}
              <van-icon :name="item.icon" />
            </span>
          </div>
        </div>
      </van-sticky>
      <div class="productList clearfix">
        <div class="productItem" v-for="item in nowProducts" :key="JSON.stringify(item)">
          <van-image
            @click="showDetail(item)"
            width="100%"
            height="180"
            fit="cover"
            :src="getZhutu(item)"
          />
          <div class="text">
            <p class="title">
              {{item.name}}
              {{item.unit}}
            </p>
            <p class="note" v-if="item.info">{{item.info}}</p>
            <p class="note" v-else>{{item.name + item.unit}}</p>

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
    </template>
    <template v-if="setting.modeType == 1">
      <div class="modeType1">
        <van-sidebar v-model="nowIndexb" class="sidebar">
          <van-sidebar-item
            :title="item.name"
            v-for="item in category"
            :key="JSON.stringify(item)"
          />
        </van-sidebar>
        <div class="modeType1-right">
          <div class="switchItem">
            <div class="youhui" v-if="youhui.length" @click="showYouhuiVisible=true">
              <van-tag plain type="warning">{{youhui[0]}}</van-tag>
              <van-tag plain type="warning">更多优惠</van-tag>
            </div>
            <div class="sortWrap">
              <span
                v-for="(item,index) in sortConfig"
                :key="JSON.stringify(item)"
                :class="[item.active&&'active']"
                @click="sort(index)"
              >
                {{item.name}}
                <van-icon :name="item.icon" />
              </span>
            </div>
          </div>
          <div class="productList" ref="productList">
            <template v-for="(item,index) in nowProducts">
              <div
                class="productItem clearfix"
                :key="JSON.stringify(item)"
              >
                <van-image
                  @click="showDetail(item)"
                  width="75"
                  height="75"
                  fit="cover"
                  :src="getZhutu(item)"
                  class="image"
                />
                <div class="text">
                  <p class="title">
                    {{item.name}}
                    {{item.unit}}
                  </p>
                  <p class="note" v-if="item.info">{{item.info}}</p>
                  <p class="note" v-else>{{item.name + item.unit}}</p>

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
              <van-divider v-if="index < nowProducts.length - 1" :key="JSON.stringify(item)" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <van-popup
      v-model="showDetailVisible"
      round
      position="bottom"
      :style="{ height: '96%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="detailModal">
        <swiper ref="mySwiper" style="height: 220px">
          <!-- slides -->
          <swiper-slide v-for="item in nowProduct.pics" :key="item">
            <van-image width="100%" height="100%" fit="cover" :src="domain + item" />
          </swiper-slide>
        </swiper>
        <div class="text detailText">
          <p class="title">
            <span>{{nowProduct.name}}</span>
            {{nowProduct.unit}}
          </p>
          <p class="note" v-if="nowProduct.info">{{nowProduct.info}}</p>
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
          <div v-html="nowProduct.content"></div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="showYouhuiVisible"
      closeable
      position="bottom"
      round
      :style="{ height: '30%' }"
    >
      <div class="youhuiModal">
        <h4>优惠活动</h4>
        <div class="youhuiItem">
          <van-tag type="warning" size="large">首单立减</van-tag>
          <template v-for="item in youhui">
            <van-tag
              type="danger"
              :key="JSON.stringify(item)"
              plain
              v-if="item.indexOf('首')>-1"
            >{{item}}</van-tag>
          </template>
        </div>
        <div class="youhuiItem">
          <van-tag type="warning" size="large">满减优惠</van-tag>
          <template v-for="item in youhui">
            <van-tag
              type="danger"
              :key="JSON.stringify(item)"
              plain
              v-if="item.indexOf('满')>-1"
            >{{item}}</van-tag>
          </template>
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
      nowName: "商品分类",
      nowProducts: [],
      showDetailVisible: false,
      nowProduct: {},
      youhui: [],
      showYouhuiVisible: false,
      nowIndexb: 0,
      notice: {},
      showNotice: false
    };
  },
  created() {
    this.getBanner();
    this.getCategory();
    this.getNotice();
  },
  mounted() {
    this.swiper.slideTo(3, 1000, false);
  },
  methods: {
    ...mapMutations(["cartListSave", "sortConfigSave", "nowIndexSave"]),
    getBanner() {
      this.$axios.get("/getBanner").then(res => {
        const { data } = res;
        if (data.status === 1) this.banner = data.arr;
      });
    },
    getNotice() {
      this.$axios.get("/getNotice").then(res => {
        const { data } = res;
        if (data.status === 1) {
          this.notice = data.data;
          this.showNotice = true;
        } 
      });
    },
    gotoArticle(id) {
      this.$router.push(`/article?id=${id}`);
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
            if (el.content) el.content = this.formatContent(el.content);
            el.selNum = 0;
          });
        });
        //在购物车中循环查找category中的商品，如果找得到则赋予selNum，找不到就删除购物车中的商品
        cartList.forEach((ct, index) => {
          let has = false;
          arr.forEach(item => {
            const proHas = item.pro.findIndex(el => ct.id == el.id);
            if (proHas >= 0) {
              has = true;
              //检查购物车中的商品是否大于库存商品
              if (ct.selNum > item.pro[proHas].num) {
                item.pro[proHas].selNum = item.pro[proHas].num;
              } else {
                item.pro[proHas].selNum = ct.selNum;
              }
            }
          });
          //多次循环arr后，如果在商品列表找不到购物车中的商品，则移除该商品
          if (!has) {
            cartList.splice(index, 1, {});
          }
        });
        const cartLists = cartList.filter(item => item.id);
        this.cartListSave(cartLists);
        this.nowIndexb = this.$store.state.nowIndex;
        this.category = arr;
        this.nowProducts = arr[this.nowIndexb].pro;
        this.nowProduct = arr[this.nowIndexb].pro[0];
        //获取优惠
        this.calcYouhui();
        this.sortStart();
      });
    },
    getZhutu(item) {
      if (item.zhutu) return this.domain + item.zhutu;
      const pic = item.pic.split(",");
      return this.domain + pic;
    },
    numAdd(item) {
      if (item.selNum < item.num) {
        item.selNum += 1;
      } else {
        return Notify({ type: "warning", message: "购物量超过商品库存!" });
      }

      let cartList = this.cartList;
      const has = cartList.findIndex(el => el.id == item.id);
      if (has >= 0) {
        cartList.splice(has, 1, item);
      } else {
        cartList.push(item);
      }
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
    formatContent(content) {
      if (content.indexOf(this.domain) < 0) {
        content = content.replace(/\/Public/gi, this.domain + "/Public");
      }
      return content;
    },
    calcYouhui() {
      const { setting } = this.$store.state;
      let youhui = [];
      const firstOrderSale = parseInt(setting.firstOrderSale);
      if (firstOrderSale > 0) {
        youhui.push(`首单减${firstOrderSale}`);
      }
      if (setting.countMoLing) {
        const arr = setting.countMoLing.split(",");
        arr.forEach(el => {
          let xx = el.split("-");
          youhui.push(`满${xx[0]}减${xx[1]}`);
        });
      }
      this.youhui = youhui;
    },
    sort(index) {
      let sortConfig = this.sortConfig;
      if (sortConfig[index].active == false) {
        sortConfig.forEach(it => {
          it.active = false;
        });
        sortConfig[index].active = true;
        this.sortConfigSave(sortConfig);
        this.sortStart();
      }
    },
    sortStart() {
      const i = this.sortConfig.findIndex(item => item.active == true);
      if (i === 0 || i === 1 || i === 2) {
        switch (i) {
          case 0:
            this.nowProducts.sort(this.compare("price"));
            break;
          case 1:
            this.nowProducts.sort(this.compare("sales"));
            break;
          case 2:
            this.sortChinese();
            break;
        }
      }
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (property == "price") return value1 - value2;
        return value2 - value1;
      };
    },
    sortChinese() {
      const dataLeven = "name";
      function getValue(option) {
        // 参数： option 数组元素
        if (!dataLeven) return option;
        var data = option;
        dataLeven.split(".").filter(function(item) {
          data = data[item];
        });
        return data + "";
      }
      this.nowProducts.sort(function(item1, item2) {
        return getValue(item1).localeCompare(getValue(item2), "zh-CN");
      });
    }
  },
  computed: {
    ...mapState([
      "domain",
      "cartList",
      "cartNums",
      "sortConfig",
      "nowIndex",
      "setting"
    ]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  watch: {
    nowIndexb() {
      this.nowIndexSave(this.nowIndexb);
      this.nowName = this.category[this.nowIndexb].name;
      this.nowProducts = this.category[this.nowIndexb].pro;
      window.scrollTo(0, 0);
      this.sortStart();
    }
  }
};
</script>

<style lang="less" >
@borderCorle: #efefef;
@baseColor:#f69e2a;
.clearfix:after {
visibility: hidden;
display: block;
font-size: 0;
content: " ";
clear: both;
height: 0;
}
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
  background: #fff
}
.youhui{
  display: flex;
  align-items: center;
  span{
    font-size: 11px;
    margin: 0 3px
  }
}
.van-dropdown-menu {
  height: 40px !important;
  width: 18%;
  border: none !important;
  border-right: 1px solid @borderCorle !important;
  padding-right: 10px;
}
.van-dropdown-menu__title {
  font-size: 12px !important;
}
.sortWrap {
  font-size: 12px;
  display: flex;
  align-items: center;
  span {
    margin-right: 8px;
    i {
      top: 2px;
      position: relative;
    }
  }
  span.active{
    color: #f69e2a
  }
}
.productList {
  background: #f1f2f3;
  padding: 2% 0;
  .productItem {
    width: 45.5%;
    float: left;
    margin-left: 3%;
    background-color: #fff;
    margin-bottom: 2.5%;
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
    margin: 0;
    }
    .note {
    font-size: 11px;
    color: #777;
    padding: 5px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 15px;
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
    margin-top: 50px;
}
.detailDetail{
    border-top: 10px solid #eee;
    padding: 0 20px;
    img{
        max-width: 100%;
    }
}
.youhuiModal{
  margin: 30px 0 20px 0;
  h4{
    text-align: center
  }
  .youhuiItem{
    margin: 10px 20px;
    span{
      margin-right: 10px
    }
  }
}
.outsideWrap{
  height: 100%;
  padding: 0 !important;
}
.modeType1{
  height: 68%;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  .sidebar{
    height: 100%;
    overflow:scroll;
    width: 22%;
    .van-sidebar-item{
      padding: 10px 12px 10px 8px !important;
      font-size: 14px !important;
      text-align: center;
      border-left: none;
      background: #f69e2a !important ;
      color: #fff;
    }
    .van-sidebar-item--select{
      background: #fff !important;
      color: #f69e2a
    }
  }
  .modeType1-right{
    width: 76%;
    overflow: scroll;
    position: relative;
    padding-bottom: 25px;
    height: calc(100% - 25px);
    .switchItem{
      padding: 10px 0;
      margin-bottom: 10px;
    }
    .productList{
      background: #fff;
      padding: 0;
      .productItem{
        float: none;
        width: 100%;
        margin: 0;
        padding: 10px 0;
        .image{
          float: left;
          width: 75px;
        }
        .text{
          padding: 0;
          float: left;
          width: calc(96% - 75px);
          margin-left: 2%;
        }
      }
    }
  }
  
}
</style>
