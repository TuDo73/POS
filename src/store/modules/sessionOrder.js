import { globalFunction } from '@/global/global.js';

const state = { // data
  sessionOrder: {}
};
const getters = { // computed
};

const actions = { // methods
};

const mutations = { // handle response from actions to update state
  setSessionOrderData(state, value) {
    state.sessionOrder = value[0];
    console.log('state.sessionOrder:', state.sessionOrder);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}