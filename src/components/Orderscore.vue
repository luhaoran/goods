<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="订单评价" />
    <div class="scoreWrap">
      <div class="scoreItem">
        <p>产品描述相符</p>
        <van-rate :size="26" v-model="score.s1" />
      </div>
      <div class="scoreItem">
        <p>物流服务态度</p>
        <van-rate :size="26" v-model="score.s2" />
      </div>
      <div class="scoreItem">
        <p>商家发货速度</p>
        <van-rate :size="26" v-model="score.s3" />
      </div>
    </div>
    <div class="inputWrap">
      <van-field
        v-model="content"
        type="textarea"
        placeholder="本次交易体验：说说本次交易中的美中不足吧，您的建议是我们前进的动力。"
        class="input"
        rows="4"
      />
    </div>
    <van-button type="warning" @click="submit" class="quitBtn" round block>提交退款</van-button>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Orderscore",
  components: {
    Navbar
  },
  data() {
    return {
      score:{
        s1:0,
        s2:0,
        s3:0
      },
      content: "",
      order: {},
      id:0
    };
  },
  created() {},
  mounted() {
    const id = this.$route.query.id;
    if (!id) return this.$router.push("/order");
    this.id = id
    this.getOrderInfo(id);
    
  },

  methods: {
    submit() {
      const user = this.user
      this.$axios.get("/setScore",{params:{user,score:this.score,content:this.content,id:this.id}}).then(({data})=>{
        if(data.status === 1){
          Notify({ type: 'success', message: '评价成功' });
          return this.$router.go(-1)
        }else{
          return Notify({ type: 'danger', message: '评价失败，请稍后再试' });
        }
      })
    },
    getOrderInfo(id) {
      if (!id) return;
      const user = this.user;
      console.log(user, id);
      this.$axios
        .get("/getOrder", { params: { user, id } })
        .then(({ data }) => {
          if (data.status === 1) {
            const arr = data.arr
            if(arr.score){
              this.score = arr.score.score;
              this.content = arr.score.content
            }
          }
        });
    }
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {}
};
</script>

<style lang="less" scope>
.scoreWrap {
  margin: 25px 5% 15px 5%;
  background: #fff;
  text-align: center;
  padding: 20px 0;
  border-radius: 5px;
  .scoreItem {
    margin: 20px 0;
    p {
      margin-bottom: 8px;
      font-size: 16px;
    }
  }
}
.inputWrap {
  margin: 15px 5%;
  .input {
    border-radius: 5px;
    margin-bottom: 10px;
  }
}
.quitBtn {
  transform: scale(0.9);
  margin-top: 10px;
}
</style>
