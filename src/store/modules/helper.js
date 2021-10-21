import { globalFunction } from '@/global/global.js';

const state = { // data
  isShowLoading: false,
  isActiveKeyboard: false,
  isActiveMultipleFieldKeyboard: false,
  isActivePopupKeyboard: false,
  isActiveSearchKeyboard: false,
  isActiveSearchListKeyboard: false,
  isActiveNumberKeyboard: false,
  isDoStornoAll: false,
  isShowSearch: false,
  isOverDiscount: false,
  discountLocation: '',
  isOnSmallScreen: false,
  isGetOrdersFinished: false,
  isPaymentCash: false,
  isValidValueDiscount: true,
  isLoadingPopupMoveDish: false,
  isLoadingPopupChangeUser: false,
  isOpenKeyboardRetour: false,
};

const getters = { // computed

};

const actions = { // methods
	updateKeyboardState({state, commit, dispatch}, value) {
    state.isActiveKeyboard = value;
  },

  showHideMultipleFieldKeyboard({state, commit, dispatch}, value) {
    state.isActiveMultipleFieldKeyboard = value;
  },

  showHidePopupKeyboard({state, commit, dispatch}, value) {
    state.isActivePopupKeyboard = value;
  },

  showHideSearchKeyboard({state, commit, dispatch}, value) {
    state.isActiveSearchKeyboard = value;
  },

  updateSearchState({state}) {
    state.isShowSearch = !state.isShowSearch;
  },

  showHideSearchListKeyboard({state, commit, dispatch}, value) {
    state.isActiveSearchListKeyboard = value;
  },

  showHideNumberKeyboard({state, commit, dispatch}, value) {
    state.isActiveNumberKeyboard = value;
  },

  hideAllKeyboard({state, commit, dispatch}) {
    dispatch('updateKeyboardState', false);
    dispatch('showHideMultipleFieldKeyboard', false);
    dispatch('showHidePopupKeyboard', false);
    dispatch('showHideSearchKeyboard', false);
    dispatch('showHideSearchListKeyboard', false);
    dispatch('showHideNumberKeyboard', false);
    commit('setStateOpenKeyboardRetour', false);
  }
};

const mutations = { // handle response from actions to update state
  showLoading(state, loading) {
    state.isShowLoading = loading;
  },

  setStornoAll(state, value) {
    state.isDoStornoAll = value;
  },

  setStateOverDiscount(state, value) {
    state.isOverDiscount = value;
  },

  setStateDiscountLocation(state, value) {
    state.discountLocation = value;
  },

  setDetectScreenSize(state, value) {
    state.isOnSmallScreen = value;
  },

  setStateGetOrdersFinished(state, value) {
    state.isGetOrdersFinished = value;
  },

  setPaymentType(state, value) {
    state.isPaymentCash = value;
  },

  setStateValidDiscountValue(state, value) {
    state.isValidValueDiscount = value;
  },

  setStateLoadingPopupMoveDish(state, value) {
    state.isLoadingPopupMoveDish = value;
  },

  setStateLoadingPopupChangeUser(state, value) {
    state.isLoadingPopupChangeUser = value;
  },

  setStateOpenKeyboardRetour(state, value) {
    state.isOpenKeyboardRetour = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}