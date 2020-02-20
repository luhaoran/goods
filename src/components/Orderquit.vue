<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="申请退款" />
    <div v-if="hasQuit" class="hasQuit">
      <p v-if="quitInfo.state == 0" class="result">您的申请已提交，正在审核中</p>
      <p v-if="quitInfo.state == 1" class="result">已退款成功</p>
      <div class="quitArea">
        <p class="tkxq">退款详情</p>
        <van-divider />
        <div class="items">
          <div class="item">
            <span class="label">申请时间</span>
            <i>{{quitInfo.time}}</i>
          </div>
          <div class="item">
            <span class="label">退款金额</span>
            <i>{{quitInfo.quitPrice}}</i>
          </div>
          <div class="item">
            <span class="label">退款原因</span>
            <i>{{quitInfo.content}}</i>
          </div>
        </div>
      </div>
    </div>
    <div class="quitWrap" v-else>
      <div v-if="quitInfo.state == 2" class="info">
        <h5>您的退款未通过，原因是</h5>
        <p>“{{quitInfo.notQuit}}”</p>
        <span>- 您可以尝试重新提交退款申请 -</span>
      </div>
      <van-field
        v-model="quitPrice"
        type="number"
        :error-message="ErrorMsg"
        required
        :placeholder="`最大退款金额为${order.payment}元`"
        class="input"
      />
      <van-field
        v-model="content"
        type="textarea"
        :error-message="InfoErrorMsg"
        required
        placeholder="请说明退款原因"
        class="input"
        rows="4"
        @blur="infoBlur"
      />
      <div class="imageUpload">
        <van-uploader v-model="pics" :max-count="3" :after-read="afterRead" />
      </div>
      <van-button type="warning" class="quitBtn" round block @click="submit">提交退款</van-button>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Orderquit",
  components: {
    Navbar
  },
  data() {
    return {
      id: 0,
      order: {},
      quitPrice: "",
      ErrorMsg: "",
      InfoErrorMsg: "",
      pics: [],
      quit: 0,
      content: "",
      quitInfo:{},
      hasQuit: false
    };
  },
  created() {},
  mounted() {
    const id = this.$route.query.id;
    if (!id) return this.$router.push("/order");
    this.getOrderInfo(id);

    //获取退款申请状态
    this.getQuitOrderInfo(id);
  },

  methods: {
    getOrderInfo(id) {
      if (!id) return;
      const user = this.user;
      console.log(user, id);
      this.$axios
        .get("/getOrder", { params: { user, id } })
        .then(({ data }) => {
          if (data.status === 1) {
            this.order = data.arr;
          }
        });
    },
    infoBlur() {
      if (this.content.length < 10) {
        this.InfoErrorMsg = "多写几个字吧";
      } else {
        this.InfoErrorMsg = "";
      }
    },
    afterRead(pic) {
      const user = this.user;
      const obj = { user,pic };
      this.$axios.post("/uploadPicH5", JSON.stringify(obj)).then(({ data }) => {
        console.log(data)
      });
    },
    submit() {
      const user = this.user;
      const content = this.content;
      const quitPrice = this.quitPrice;
      const order = this.order;
      if (!quitPrice || quitPrice > order.payment) {
        return Notify({ type: "danger", message: "请输入正确的退款金额" });
      }
      if (content.length < 10) {
        return Notify({ type: "danger", message: "多写几个字吧" });
      }
      this.$axios
        .get("/subQuitOrder", { params: { user, content, quitPrice } })
        .then(({ data }) => {
          if (data.status === 1) {
            Notify({ type: "success", message: "退款申请成功" });
            return this.$router.go(-1);
          }
        });
    },
    getQuitOrderInfo(id) {
      this.$axios.get(`/getQuitOrderInfo?id=${id}`).then(({ data }) => {
        if (data.status === 1) {
          this.quit = 1;
          this.quitInfo = data.arr;
          if (data.arr.status < 2) this.hasQuit = true;
        }
      });
    }
  },
  computed: {
    ...mapState(["user", "domain"])
  },
  watch: {
    quitPrice() {
      if (this.quitPrice > this.order.payment) {
        this.ErrorMsg = "填写金额大于订单支付金额，请重新填写";
      } else {
        this.ErrorMsg = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.quitWrap {
  width: 95%;
  padding: 25px 0;
  margin: 0 auto;
  .input {
    border-radius: 5px;
    margin-bottom: 10px;
  }
}
.quitBtn {
  transform: scale(0.9);
  margin-top: 10px;
}
.imageUpload {
  padding: 12px;
  background: #fff;
  border-radius: 5px;
}

.hasQuit {
  margin: 25px 2.5%;
  .result {
    text-align: center;
    font-size: 16px;
    margin-bottom: 25px;
  }
  .quitArea {
    border-radius: 5px;
    box-shadow: 0 0 10px #ddd;
    overflow: hidden;
    margin-bottom: 15px;
    background: #fff;
    .tkxq {
      padding: 10px 15px;
      font-size: 12px;
      color: #999;
    }
    .items {
      padding: 8px 0;
      .item {
        padding: 8px 15px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        i {
          color: #666;
          font-style: normal;
        }
      }
    }
  }
}
.info {
  margin: 25px 2.5%;
  margin-bottom: 35px;
  text-align: center;
  h5 {
    font-size: 16px;
    margin-bottom: 25px;
    font-weight: normal;
    color: #333;
    margin: 0;
  }
  p{
    font-size: 16px;
    margin: 10px 0;
  }
  span{
    display: block;
    font-size: 14px;
  }
}
</style>
