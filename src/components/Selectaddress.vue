<template>
  <div>
    <Navbar name="选择地址" />
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
      chosenAddressId:0,
      addressList: [
        {
          id: "1",
          name: "张三",
          tel: "13000000000",
          address: "浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室"
        },
        {
          id: "2",
          name: "李四",
          tel: "1310000000",
          address: "浙江省杭州市拱墅区莫干山路 50 号"
        }
      ],
    };
  },
  created() {},
  mounted() {
    this.getAddressList();
  },

  methods: {
    ...mapMutations(["addressSave"]),
    getAddressList(){

    },
    onAdd(){
        this.$router.push('/addaddress')
    },
    onEdit(item){
        this.$router.push(`/addaddress?id=${item.id}`)
    },
  },
  computed: {
    ...mapState(["setting", "cartList", "cartNums", "domain"])
  },
  watch: {
      chosenAddressId(){
          const address = this.addressList.find(item=>item.id == this.chosenAddressId)
          this.addressSave(address)
          setTimeout(() => {
             this.$router.go(-1) 
          }, 500);
      }
  }
};
</script>

<style lang="less" scoped>
.van-address-list__add{
    background-color: #FF9813 !important;
    border-color:  #FF9813 !important;
}
</style>
