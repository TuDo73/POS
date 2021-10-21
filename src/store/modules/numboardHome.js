import { globalFunction } from '@/global/global.js';

const state = { // data
  typeInput: '',
  isActiveInvalidQuantityProductOrderlinePopup: false,
  isActiveNoProductByPlu: false,
  isMenge: false,
  valueMenge: 1,
  isNewMenge: false,
  isTableFunction: false
};
const getters = { // computed

};

const actions = { // methods
  showHidePopupInvalidQuantity({commit, state, dispatch}, value) {
    state.isActiveInvalidQuantityProductOrderlinePopup = value;
  },

  showHidePopupSearchPlu({commit, state, dispatch}, value) {
    state.isActiveNoProductByPlu = value;
  }
};

const mutations = { // handle response from actions to update state
  setTypeInput(state, type) {
    state.typeInput = type;
  },

  setMengeState(state, value) {
    state.isMenge = value;
  },

  setValueMenge(state, value) {
    state.valueMenge = value;
  },

  setNewMengeState(state, value) {
    state.isNewMenge = value;
  },

  setTableFunctionState(state, value) {
    state.isTableFunction = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}