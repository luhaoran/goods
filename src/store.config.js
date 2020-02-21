import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        domain: 'https://good.pinge.pro',
        setting: '',
        shopCode: '10005',
        request: '',
        cartList: JSON.parse(localStorage.getItem('cartList')) || [],
        cartNums: 0,
        totalPrice:0.00,
        sortConfig: [
            {
                name: "价格",
                active: false,
                icon: "arrow-down"
            },
            {
                name: "销量",
                active: false,
                icon: "arrow-down"
            },
            {
                name: "名称",
                active: false,
                icon: "arrow-down"
            }
        ],
        nowIndex: 0,
        user: JSON.parse(localStorage.getItem('user')) || {},
        address: {},
        editAddress:{},
        userInfo:JSON.parse(localStorage.getItem('userInfo')) || {},
        redTip:JSON.parse(localStorage.getItem('redTip')) || [0,0,0,0],
        baseColor:{},
        baseBgColor:{},
        baseBdColor:{},
        color:'#f69e2a'
    },
    mutations: {
        settingSave(state, value) {
            state.setting = value;
            const color = value.color || '#f69e2a'
            state.baseColor = {color:color}
            state.baseBgColor = {backgroundColor:color}
            state.baseBdColor = {borderColor:color}
            state.color = color
        },
        cartListSave(state, value) {
            state.cartList = value;
            let cartNums = 0;
            let totalPrice = 0.00
            value.forEach(el => {
                cartNums += el.selNum
                totalPrice += el.selNum * parseFloat(el.price)
                let countPrice = el.selNum * parseFloat(el.price);
                el.countPrice = countPrice.toFixed(2)
            })
            state.cartNums = cartNums;
            state.totalPrice = totalPrice;
            localStorage.setItem('cartList', JSON.stringify(value))
        },
        cartNumsSave(state, value) {
            state.cartNums = value
        },
        totalPriceSave(state, value) {
            state.totalPrice = value
        },
        sortConfigSave(state, value) {
            state.sortConfig = value
        },
        nowIndexSave(state, value) {
            state.nowIndex = value
        },
        addressSave(state, value) {
            state.address = value
        },
        editAddressSave(state, value) {
            state.editAddress = value
        },
        userInfoSave(state,value){
            state.userInfo = value;
            const user = {id:value.userId,code:value.userCode}
            state.user = user;
            localStorage.setItem('userInfo',JSON.stringify(value))
            localStorage.setItem('user',JSON.stringify(user))
        },
        redTipSave(state, value) {
            state.redTip = value
            localStorage.setItem('redTip',JSON.stringify(value))
        },
    },
})

export default store