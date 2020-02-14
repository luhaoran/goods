<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="反馈" />
    <div class="quitWrap">
      <van-field
        v-model="content"
        type="textarea"
        :error-message="infoErrorMsg"
        required
        placeholder="请留下您的宝贵意见或建议，我们将努力改进（不少于十个字，一经采纳立奖红包！）"
        class="input"
        rows="4"
        @blur="infoBlur"
      />
      <van-field v-model="phone" required placeholder="请留下手机号码，以便我们回复您" class="input" />
      <van-button type="warning" class="quitBtn" round block @click="submit">提交</van-button>

      <div class="fbList">
        <h5 class="title">反馈记录</h5>
        <van-divider />
        <div v-for="item in list" :key="JSON.stringify(item)" class="fbItem">
          <p class="time">{{item.time}}</p>
          <p class="content">{{item.content}}</p>
          <p class="return">{{item.return}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Feedback",
  components: {
    Navbar
  },
  data() {
    return {
      content: "",
      infoErrorMsg: "",
      phone: "",
      list: []
    };
  },
  created() {},
  mounted() {
    this.getFeedback();
  },

  methods: {
    infoBlur() {
      if (this.content.length < 10) {
        this.infoErrorMsg = "多写几个字吧";
      } else {
        this.infoErrorMsg = "";
      }
    },
    getFeedback() {
      const user = this.user;
      this.$axios.get("/getFeedback", { params: { user } }).then(({ data }) => {
        console.log(data);
        if (data.arr && data.arr.length) {
          this.list = data.arr;
        }
      });
    },
    submit() {
      const content = this.content;
      const phone = this.phone;
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        return Notify({ type: 'warning', message: '手机号码有误，请重新输入' });
      }
      if(content.length < 10){
        return Notify({ type: 'warning', message: '再多写点吧' });
      }
      const user = this.user
      this.$axios.get("/subFeedback",{params:{user,content,phone}}).then(({data})=>{
        if(data.status === 1){
          Notify({ type: 'success', message: '提交成功' });
          return this.$router.go(0)
        }else{
          return Notify({ type: 'danger', message: '提交失败，请稍后再试' });
        }
      })
    }
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {}
};
</script>

<style lang="less" scope>
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
.fbList {
  h5 {
    margin: 0;
  }
  .title {
    padding: 8px 0;
    border-bottom: 1px #ddd solid;
    font-size: 13px;
    margin-top: 15px;
  }
  .fbItem {
    padding: 10px 0;
    .time {
      font-size: 12px;
      color: #999;
    }
    .content {
      font-size: 13px;
      color: #666;
      padding: 5px 0;
    }
    .return {
      font-size: 13px;
      color: #5675f2;
    }
  }
}
</style>
