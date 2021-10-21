import { globalFunction } from '@/global/global.js';
import router from '@/router';

const state = { // data
  user: {},
  users: [],
  customers: [],
  sessionUser: {},
  isUserAlreadyLogin: false
};

const getters = { // computed

};

const actions = { // methods
  logout({commit, state, dispatch, rootState}) {
    router.push({ path: '/' });

    window.location.reload();
  },

  async closeSession({commit, state, dispatch, rootState}) {
    commit('helper/showLoading', true, { root: true });

    let userName = state.user.username;
    let url = globalFunction.baseUrl + 'session/close_by_user';
    let postBody = {
      'username': userName
    }
    let closeSessionData = await globalFunction.request(url, postBody);
    if(closeSessionData.successful) {
      dispatch('logout');
    }
    console.log('closeSessionData:', closeSessionData);

    commit('helper/showLoading', false, { root: true });
  }
};

const mutations = { // handle response from actions to update state
  setUser(state, value) {
    state.user = value;
  },

  setUsers(state, value) {
    state.users = value;
  },

  setCustomers(state, value) {
    state.customers = value;
  },

  setSessionUser(state, value) {
    state.sessionUser = value
  },

  setStateUserAlreadyLogin(state, value) {
    state.isUserAlreadyLogin = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}