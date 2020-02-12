<template>
  <div>
    <Navbar name="添加地址" />
    <van-address-edit
      :area-list="areaList"
      show-delete
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      :address-info="address"
    />
  </div>
</template>

<script>
import areaList from "../assets/area";
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Addaddress",
  components: {
    Navbar
  },
  data() {
    return {
      areaList,
      searchResult: [],
      address:{
          id:333,
          name:'卢浩然',
          tel:'15609636903',
          province:'安徽省',
          city:'蚌埠市',
          county:'蚌山区',
          addressDetail:'',
          areaCode:'340303'
      }
    };
  },
  created() {},
  mounted() {
      const id = this.$route.query.id;
      if(id){
          this.getAddress(id)
      }
  },

  methods: {
    onSave(){},
    onDelete(){
        console.log("1")
    },
    getAddress(id){
        console.log(id)
    }
  },
  computed: {
    ...mapState(["user"])
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
