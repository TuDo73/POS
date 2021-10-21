import { globalFunction } from '@/global/global.js';

const state = { // data
  company: {}
};
const getters = { // computed
};

const actions = { // methods
};

const mutations = { // handle response from actions to update state
  getCompany(state, value) {
    state.company = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}