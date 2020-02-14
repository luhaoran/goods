<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="统计" />
    <div class="countWrap">
      <div class="tagWrap">
        <van-tag type="warning" class="tag" size="large">
          本月排名：
          <template v-if="top">第{{top}}名</template>
          <template v-else>未上榜</template>
        </van-tag>
      </div>
      <div class="countList">
        <div class="countListHeader">
          <p class="titleRight">累计订货金额</p>
          <van-stepper v-model="year" min="2016" max="2020" />
        </div>
        <template v-for="item in list">
          <div
            :key="JSON.stringify(item)"
            v-if="(year == currentYear && item.month <= currentMonth + 1) || (year < currentYear)"
          >
            <van-divider />
            <div class="countItem">
              <p>{{year}}年{{item.month}}月累计订货：</p>
              <span>￥{{item.count}}</span>
            </div>
          </div>
        </template>
        <div class="countListFooter">
          <p class="titleRight">{{year}}年合计:</p>
          <span>￥{{total}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Eachorder",
  components: {
    Navbar
  },
  data() {
    return {
      year: new Date().getFullYear(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      list: [],
      total: 0.0,
      top: 0
    };
  },
  created() {},
  mounted() {
    this.getCount();
  },

  methods: {
    getCount() {
      const year = this.year;
      const user = this.user;
      this.$axios
        .get("/getOrderCount", { params: { year, user } })
        .then(({ data }) => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.arr.list;
            this.total = data.arr.total;
            if (data.top) this.top = data.top;
          }
        });
    }
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {
    year() {
      this.getCount();
    }
  }
};
</script>

<style lang="less" scope>
.tagWrap {
  display: flex;
  justify-content: center;
  padding: 25px 0;
  .tag {
    padding: 0.6em 2em !important;
  }
}
.countList {
  background: #fff;
  margin: 20px 5%;
  margin-top: 0;
  border-radius: 5px;
  .countListHeader {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
  }
  .countListFooter {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background: #eee;
    span{
      font-weight: bold;
      color: #222
    }
  }
  .countItem {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 15px;
    span {
      color: #222;
    }
  }
}
.van-stepper__input {
  padding: 0 10px !important;
  width: 60px !important;
}
</style>
