import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        domain: 'https://good.pinge.pro',
        userInfo: '',
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
        user: {
            id: '536',
            code: 'e2ed2e34332c39483cba6b42d496605bd7bdc8e5'
        },
        address: {},
        editAddress:{}
    },
    mutations: {
        userInfoSave(state, value) {
            state.userInfo = value
        },
        settingSave(state, value) {
            state.setting = value
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
        }
    },
})

export default store