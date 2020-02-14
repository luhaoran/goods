<template>
  <div class="userWrap">
    <div class="bg"></div>
    <Navbar name="申请退款" />
    <div class="quitWrap">
      <van-field
        v-model="quitPrice"
        type="number"
        :error-message="ErrorMsg"
        required
        :placeholder="`最大退款金额为${order.payment}元`"
        class="input"
      />
      <van-field
        v-model="quitInfo"
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
      <van-button type="warning" class="quitBtn" round block>提交退款</van-button>
    </div>
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapState } from "vuex";
import Navbar from "./Navbar";
import qs from 'qs'
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
      ErrorMsg:'',
      quitInfo:'',
      InfoErrorMsg:'',
      pics:[]
    };
  },
  created() {},
  mounted() {
    const id = this.$route.query.id;
    if (!id) return this.$router.push("/order");
    this.getOrderInfo(id);
  },

  methods: {
    getOrderInfo(id) {
      if (!id) return;
      const user = this.user;
      console.log(user,id)
      this.$axios
        .get("/getOrder", { params: { user, id } })
        .then(({ data }) => {
          if (data.status === 1) {
            this.order = data.arr;
          }
        });
    },
    infoBlur(){
      if(this.quitInfo.length < 10){
        this.InfoErrorMsg = '多写几个字吧'
      }else{
        this.InfoErrorMsg = ''
      }
    },
    afterRead(){
      const user = this.user
      const obj = {user}
      this.$axios.post('/uploadPic',qs.stringify(obj)).then(({data})=>{
        console.log(data)
      })
    }
  },
  computed: {
    ...mapState(["user", "domain"])
  },
  watch: {
    quitPrice(){
      if(this.quitPrice > this.order.payment){
        this.ErrorMsg = '填写金额大于订单支付金额，请重新填写'
      }else{
        this.ErrorMsg = ''
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
    margin-bottom: 10px
  }
}
.quitBtn{
  transform: scale(.9);
  margin-top: 10px
}
.imageUpload{
  padding: 12px;
  background: #fff;
  border-radius: 5px
}
</style>
