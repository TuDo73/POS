import { globalFunction } from '@/global/global.js';

const state = { // data
  lang: 'de',
};
const getters = { // computed

};

const actions = { // methods
};

const mutations = { // handle response from actions to update state
  setLang(state, lang){
    state.lang = lang;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}