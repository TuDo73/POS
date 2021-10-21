import { globalFunction } from '@/global/global.js';

const state = { // data
  isActivePopupCheckValidPayment: false
};

const getters = { // computed
};

const actions = { // methods
  calculateOrderPayment({commit, state, dispatch, rootState}, [paramOrders, paramOrderSelected]) {
    let ordersTmp = [...paramOrders];
    let orderSelectedTmp = {...paramOrderSelected};

    orderSelectedTmp.orderDiscountValue = 0;
    orderSelectedTmp.orderDiscountType = '€';
    orderSelectedTmp.orderDiscountMax = Number(orderSelectedTmp.totalPriceWithoutDiscount) * 0.2 - (Number(orderSelectedTmp.totalPriceWithoutDiscount) - Number(orderSelectedTmp.totalPrice)); // giảm giá không quá 20%

    orderSelectedTmp.moneyToPay = orderSelectedTmp.totalPrice;
    if(orderSelectedTmp.orderDiscountValue !== 0) {
      if(orderSelectedTmp.orderDiscountType == '%') {
        orderSelectedTmp.moneyToPay = Number(orderSelectedTmp.moneyToPay) - (Number(orderSelectedTmp.moneyToPay) * Number(orderSelectedTmp.orderDiscountValue) / 100);
      }
    }
    orderSelectedTmp.moneyGiven = orderSelectedTmp.moneyToPay;
    orderSelectedTmp.moneyChange = 0;
    orderSelectedTmp.orderIncluded = [...orderSelectedTmp.orderLines];
    orderSelectedTmp.orderExcluded = [];
    
    for(let order of ordersTmp) {
      if(order.ref == orderSelectedTmp.ref) {
        order.moneyToPay = orderSelectedTmp.moneyToPay;
        order.orderIncluded = orderSelectedTmp.orderIncluded;
        order.orderExcluded = orderSelectedTmp.orderExcluded;
      }
    }

    commit('order/setOrderSelected', orderSelectedTmp, { root: true });
    commit('order/setOrders', ordersTmp, { root: true });
  },

  showHidePopupCheckValidPayment({commit, state, dispatch}, value) {
    state.isActivePopupCheckValidPayment = value;
  },
};

const mutations = { // handle response from actions to update state
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}