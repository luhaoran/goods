<template>
  <div class="userWrap">
    <div class="userbg">
      <van-image height="200" :src="bg" fit="cover"></van-image>
    </div>
    <div class="regWrap">
      <h5 class="welcome">欢迎注册</h5>
      <div class="item">
        <i class="iconfont icon-yonghu"></i>
        <van-field v-model="phone" name="手机号" placeholder="手机号" class="input" />
      </div>
      <div class="item">
        <i class="iconfont icon-mimaxiantiao"></i>
        <van-field v-model="password1" type="password" name="密码" placeholder="密码" class="input" />
      </div>
      <div class="item">
        <i class="iconfont icon-mimaxiantiao"></i>
        <van-field
          v-model="password2"
          type="password"
          name="确认密码"
          placeholder="确认密码"
          class="input"
        />
      </div>
      <van-button round block color="#f69e2a" class="subBtn" @click="onSubmit">注册</van-button>
      <h4 class="goto">
        已有账号？立即
        <router-link to="/userlogin">去登陆</router-link>
      </h4>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Userlogin",
  components: {},
  data() {
    return {
      // phone: "15609636690",
      phone: "",
      password1: "",
      password2: "",
      bg: require("../..//public/images/background2.jpg")
    };
  },
  created() {},
  mounted() {},

  methods: {
    ...mapMutations(["userInfoSave"]),
    phoneValidator(val) {
      return /1\d{10}/.test(val);
    },
    onSubmit() {
      const _this = this;
      const phone = this.phone;
      const password1 = this.password1;
      const password2 = this.password2;
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        return Notify({ type: "warning", message: "手机号格式错误" });
      }
      if (password1.length < 6 || password2.length < 6) {
        return Notify({ type: "warning", message: "密码长度应不小于6位" });
      }
      if (password1 != password2) {
        return Notify({ type: "warning", message: "两次输入的密码不一致" });
      }
      this.$axios
        .get("/pswReg", { params: { phone, password1, password2 } })
        .then(({ data }) => {
          if (data.status === 1) {
            Notify({
              type: "success",
              message: "注册成功并已自动登录，跳转中，请稍后..."
            });
            const user = {
              userId: data.userId,
              userCode: data.userCode,
              nickName: data.nickName,
              phone: data.phone
            };
            _this.userInfoSave(user);
            setTimeout(() => {
              _this.$router.push("/");
            }, 500);
          } else {
            return Notify({
              type: "danger",
              message: "用户已存在，请直接登录或访问商户小程序登录！"
            });
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

<style lang="less" scoped>
// #f69e2a
.regWrap {
  position: fixed;
  top: 13%;
  left: 5%;
  right: 5%;
  background: #fff;
  padding: 10px 20px;
  padding-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 9px 2px #eaeaea;
  .welcome {
    font-size: 20px;
    color: #333;
    letter-spacing: 6px;
    margin-bottom: 30px;
  }
  .item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #fbe8d0;
    margin-bottom: 20px;
    i.iconfont {
      color: #000;
      margin-right: 10px;
    }
    .input {
      padding: 5px 0;
    }
  }
  .subBtn {
    border-radius: 5px;
    letter-spacing: 20px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    margin-top: 40px;
    box-shadow: 1px 5px 13px 0px #f69e2a;
  }
}
.goto {
  text-align: center;
  font-size: 14px;
  color: #999;
  font-weight: normal;
  margin-top: 50px;
  a {
    color: #f69e2a;
  }
}
.userbg {
  height: 200px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
}
</style>
