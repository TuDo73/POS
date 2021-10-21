import { globalFunction } from '@/global/global.js';

const state = { // data
  orderToCompare: {},
  isDiff: false
};

const getters = { // computed
};

const actions = { // methods
  diffOrders({commit, state, dispatch, rootState}, obj) {
    if (globalFunction.checkIsObjEmpty(state.orderToCompare)) {
      state.orderToCompare = globalFunction.deepCloneObj(obj);
      state.isDiff = false;

      return;
    }

    if (JSON.stringify(state.orderToCompare) === JSON.stringify(obj)) {
      state.isDiff = true;
    } else {
      state.orderToCompare = globalFunction.deepCloneObj(obj);
      state.isDiff = false;
    }
  }
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