import { globalFunction } from '@/global/global.js';

const state = { // data
  sessionUser: {}
};
const getters = { // computed
};

const actions = { // methods
};

const mutations = { // handle response from actions to update state
  setSessionUserData(state, value) {
    state.sessionUser = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}