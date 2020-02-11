import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        domain:'https://good.pinge.pro',
        userInfo:'',
        setting:'',
        shopCode:'10005',
        request:'',
        cartList:[],
        cartNums:0
    },
    mutations:{
        userInfoSave(state,value){
            state.userInfo = value
        },
        settingSave(state,value){
            state.setting = value
        },
        cartListSave(state,value){
            state.cartList = value
        },
        cartNumsAdd(state){
            state.cartNums += 1
        },
        cartNumsRed(state){
            state.cartNums -= 1
        }
    }
})

export default store