import { globalFunction } from '@/global/global.js';

const state = { // data
  listOrders: [],
  order: {},
  retourReason: '',
  actionRetour: false,
  tempOrders: [],
  listOrdersForShowOriginal: []
};
const getters = { // computed
};

const actions = { // methods
  searchListOrder({commit, state, dispatch}, searchValue) {
    if (searchValue.length > 0) {
      state.tempOrders = [...state.listOrdersForShowOriginal].filter(item => {
        let itemBeleg = item.beleg.toString().toLowerCase();
        let itemPrice = item.totalPrice.toString().toLowerCase();
        let searchString = itemBeleg + itemPrice;
        return searchString.includes(searchValue);
      });
    } else {
      state.tempOrders = [...state.listOrdersForShowOriginal];
    }
  },
};

const mutations = { // handle response from actions to update state
  setListOrdersData(state, value) {
    state.listOrders = globalFunction.deepCloneObj(value);
    // console.log('state.listOrders:', state.listOrders);
  },

  setOrder(state, value) {
    state.order = globalFunction.deepCloneObj(value);
    // console.log('state.order:', state.order);
  },

  setRetourReason(state, value) {
    state.retourReason = value;
  },

  setActionRetour(state, value) {
    state.actionRetour = value;
  },

  setListOrdersForShowOriginal(state, value) {
    state.listOrdersForShowOriginal = value;
  },

  setTempOrders(state) {
    state.tempOrders = globalFunction.deepCloneObj(state.listOrdersForShowOriginal);
    // console.log(state.tempOrders);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}