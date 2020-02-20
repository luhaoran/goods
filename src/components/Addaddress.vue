<template>
  <div>
    <Navbar name="添加地址" />
    <van-address-edit
      :area-list="areaList"
      :show-delete="address.id>0"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete(address.id)"
      :address-info="address"
    />
  </div>
</template>

<script>
import areaList from "../assets/area";
import { mapState } from "vuex";
import Navbar from "./Navbar";
import { Notify } from 'vant';
export default {
  name: "Addaddress",
  components: {
    Navbar
  },
  data() {
    return {
      areaList,
      searchResult: [],
      address: {
        name: "",
        tel: "",
        province: "安徽省",
        city: "蚌埠市",
        county: "蚌山区",
        addressDetail: "",
        areaCode: "340303"
      }
    };
  },
  created() {},
  mounted() {
    const { editAddress,userInfo } = this.$store.state;
    this.address.tel = userInfo.phone
    if (editAddress.id) {
      let address = editAddress;
      address.areaCode = address.cityCode;
      address.addressDetail = address.detailInfo;
      this.address = address;
    }
  },

  methods: {
    onSave(content) {
      const saveAddress = content;
      let address = {};
      address.userName = saveAddress.name;
      address.telNumber = saveAddress.tel;
      address.provinceName = saveAddress.province;
      address.cityName = saveAddress.city;
      address.countyName = saveAddress.county;
      address.detailInfo = saveAddress.addressDetail;
      address.cityCode = saveAddress.areaCode;
      if(this.address.id) address.id = this.address.id
      const user = this.user;
      this.$axios.get("/saveUserAddress", {
        params: {
          user,
          address
        }
      }).then(res=>{
        const { data } = res;
        if(data.status === 1){
          Notify({ type: 'primary', message: '保存成功，自动跳转中！' });
          setTimeout(() => {
            this.$router.go(-1)
          }, 800);
        }else{
          Notify({ type: 'danger', message: '保存失败，请稍后再试' });
        }
      });
    },
    onDelete(id) {
      const user = this.user;
      this.$axios.get("/delUserAddress",{params:{user,id}}).then(res=>{
        const { data } = res;
        if(data.status === 1){
          Notify({ type: 'primary', message: '删除成功！' });
          this.$router.go(-1)
        }else{
          Notify({ type: 'danger', message: '删除失败，请稍后再试' });
        }
      })
    }
  },
  computed: {
    ...mapState(["user", "editAddress","userInfo"])
    
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.van-button--danger {
  background-color: #ff9813 !important;
  border-color: #ff9813 !important;
}
</style>
