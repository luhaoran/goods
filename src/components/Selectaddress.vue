<template>
  <div>
    <Navbar name="选择地址" />
    <div v-if="showLoading" class="showloading">
      <van-loading />
    </div>
    <van-address-list
      v-model="chosenAddressId"
      :list="addressList"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapMutations, mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Selectaddress",
  components: {
    Navbar
  },
  data() {
    return {
      searchValue: "",
      chosenAddressId: 0,
      showLoading: true,
      addressList: []
    };
  },
  created() {},
  mounted() {
    this.getAddressList();
  },

  methods: {
    ...mapMutations(["addressSave", "editAddressSave"]),
    getAddressList() {
      const user = this.user;
      this.$axios.get("/userAddressList", { params: { user } }).then(res => {
        const { data } = res;
        if (data.status === 1 && data.arr && data.arr.length > 0) {
          let addressList = data.arr;
          addressList.forEach(el => {
            el.name = el.userName;
            el.tel = el.telNumber;
            el.address =
              el.provinceName + el.cityName + el.countyName + el.detailInfo;
          });
          this.addressList = addressList;
        }
        this.showLoading = false;
      });
    },
    onAdd() {
      this.editAddressSave({});
      this.$router.push("/addaddress");
    },
    onEdit(item) {
      this.editAddressSave(item);
      this.$router.push(`/addaddress`);
    }
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums", "domain", "user"])
  },
  watch: {
    chosenAddressId() {
      const address = this.addressList.find(
        item => item.id == this.chosenAddressId
      );
      this.addressSave(address);
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.van-address-list__add {
  background-color: #ff9813 !important;
  border-color: #ff9813 !important;
}
.showloading {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
