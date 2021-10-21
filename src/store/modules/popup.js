import { globalFunction } from '@/global/global.js';

const state = { // data
  isActivePopup: false,
  isActiveAlertChangePrice: false,
  isActiveAlertDiscount: false,
  isActiveNoticeOrderConfirmPopup: false,
  isActivePopupPasswordAdmin: false,
  isActivePopupReasonStorno: false,
  isActivePopupNoProductForPay: false,
  isActivePopupNeedConfirmProduct: false,
  isActivePopupTableBusy: false,
  isActivePopupTableNotAvailable: false,
  isActiveChangeTextErrorPopup: false,
  isActiveOpenNewSessionPopup: false,
  isActivePopupConfirmCloseSession: false,
  isActivePopupOrderNotEmpty: false,
  isActivePopupPasswordAdminRetour: false,
  isActivePopupPasswordAdminUmsatz: false,
  isActivePopupChangePaymentMethod: false,
};
const getters = { // computed

};

const actions = { // methods
  closePopup({commit, state, dispatch}) {
    dispatch('popup/updatePopupState', false, {root: true});
    dispatch('numboardHome/showHidePopupInvalidQuantity', false, {root: true});
    dispatch('numboardHome/showHidePopupSearchPlu', false, {root: true});
    dispatch('order/showHidePopupDiscount', false, {root: true});
    dispatch('order/showHidePopupExtra', false, {root: true});
    dispatch('table/showHidePopupChangeText', false, {root: true});
    dispatch('table/showHidePopupDeleteArea', false, {root: true});
    dispatch('order/showHidePopupChangePrice', false, {root: true});
    dispatch('popup/updatePopupAlertChangePrice', false, {root: true});
    dispatch('popup/updatePopupAlertDiscount', false, {root: true});
    dispatch('order/showHidePopupTogo', false, {root: true});
    dispatch('popup/updatePopupNoticeOrderConfirm', false, {root: true});
    dispatch('helper/hideAllKeyboard', null, {root: true});
    dispatch('popup/updatePopupPasswordAdmin', false, {root: true});
    dispatch('popup/updatePopupReasonStorno', false, {root: true});
    dispatch('popup/updatePopupNoProductForPay', false, {root: true});
    dispatch('popup/updatePopupNeedConfirmProduct', false, {root: true});
    dispatch('popup/updatePopupTableBusy', false, {root: true});
    dispatch('popup/updatePopupChangeTextError', false, {root: true});
    dispatch('popup/updatePopupTableNotAvailable', false, {root: true});
    dispatch('popup/updatePopupOpenNewSession', false, {root: true});
    dispatch('popup/updatePopupConfirmCloseSession', false, {root: true});
    dispatch('order/showHidePopupMoveDish', false, {root: true});
    dispatch('order/showHidePopupConfirmMoveDish', false, {root: true});
    dispatch('order/showHidePopupChangeUser', false, {root: true});
    dispatch('order/showHidePopupConfirmChangeUser', false, {root: true});
    dispatch('payment/showHidePopupCheckValidPayment', false, {root: true});
    dispatch('popup/updatePopupOrderNotEmpty', false, {root: true});
    dispatch('order/showHidePopupAlertSelectProduct', false, {root: true});
    dispatch('popup/updatePopupPasswordAdminRetour', false, {root: true});
    dispatch('popup/updatePopupPasswordAdminUmsatz', false, {root: true});
    dispatch('order/showHidePopupReasonRetour', false, {root: true});
    dispatch('order/showHidePopupAlertEnterRetourInput', false, {root: true});
    dispatch('order/showHidePopupNoProductRetour', false, {root: true});
    dispatch('popup/updatePopupChangePaymentMethod', false, {root: true});
  },

  updatePopupState({commit, state, dispatch}, value) {
    state.isActivePopup = value;
  },

  updatePopupAlertChangePrice({commit, state, dispatch}, value) {
    state.isActiveAlertChangePrice = value;
  },

  updatePopupAlertDiscount({commit, state, dispatch}, value) {
    state.isActiveAlertDiscount = value;
  },

  updatePopupNoticeOrderConfirm({commit, state, dispatch}, value) {
    state.isActiveNoticeOrderConfirmPopup = value;
  },

  updatePopupPasswordAdmin({commit, state, dispatch}, value) {
    state.isActivePopupPasswordAdmin = value;
  },

  updatePopupReasonStorno({commit, state, dispatch}, value) {
    state.isActivePopupReasonStorno = value;
  },

  updatePopupNoProductForPay({commit, state, dispatch}, value) {
    state.isActivePopupNoProductForPay = value;
  },

  updatePopupNeedConfirmProduct({commit, state, dispatch}, value) {
    state.isActivePopupNeedConfirmProduct = value;
  },

  updatePopupTableBusy({commit, state, dispatch}, value) {
    state.isActivePopupTableBusy = value;
  },

  updatePopupTableNotAvailable({commit, state, dispatch}, value) {
    state.isActivePopupTableNotAvailable = value;
  },

  updatePopupChangeTextError({commit, state, dispatch}, value) {
    state.isActiveChangeTextErrorPopup = value;
  },

  updatePopupOpenNewSession({commit, state, dispatch}, value) {
    state.isActiveOpenNewSessionPopup = value;
  },

  updatePopupConfirmCloseSession({commit, state, dispatch}, value) {
    state.isActivePopupConfirmCloseSession = value;
  },

  updatePopupOrderNotEmpty({commit, state, dispatch}, value) {
    state.isActivePopupOrderNotEmpty = value;
  },

  updatePopupPasswordAdminRetour({commit, state, dispatch}, value) {
    state.isActivePopupPasswordAdminRetour = value;
  },

  updatePopupPasswordAdminUmsatz({commit, state, dispatch}, value) {
    state.isActivePopupPasswordAdminUmsatz = value;
  },

  updatePopupChangePaymentMethod({commit, state, dispatch}, value) {
    state.isActivePopupChangePaymentMethod = value;
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