import { globalFunction } from '@/global/global.js';

const state = { // data
  categories: [],
  catPageNumber: 5,
  catPageNumberSmallScreen: 3,
  startIndex: 4,
  startIndexSmallScreen: 2,
  catPaging: [],
  categoriesFilter: []
};
const getters = { // computed
};

const actions = { // methods
  setCatPaging({ commit, state, rootState }) {
    state.catPaging = [];

    if (!rootState.helper.isOnSmallScreen) {
      if(state.catPageNumber >= state.categories.length) {
        state.catPageNumber = state.categories.length;
      }

      for(let i = 0; i < state.catPageNumber; i++) {
        state.catPaging.push(state.categories[i]);
      }
    } else {
      for(let i = 0; i < state.catPageNumberSmallScreen; i++) {
        state.catPaging.push(state.categories[i]);
      }
    }
  },

  handleChangeCatePage({ state, commit, dispatch, rootState }, direction) {
    if(direction == 'prev') {
      if (!rootState.helper.isOnSmallScreen) {
        state.startIndex = state.startIndex - 10 > -1 ? state.startIndex - 10 : state.categories.length + (state.startIndex - 10);
      } else {
        state.startIndexSmallScreen = state.startIndexSmallScreen - 6 > -1 ? state.startIndexSmallScreen - 6 : state.categories.length + (state.startIndexSmallScreen - 6);
      } 
        
      dispatch('getNextItem');
    }

    if(direction == 'next') {
      if (!rootState.helper.isOnSmallScreen && state.categories.length <= state.catPageNumber) {
        return;
      }

      if (rootState.helper.isOnSmallScreen && state.categories.length <= state.catPageNumberSmallScreen) {
        return;
      }

      dispatch('getNextItem');
    }
  },

  getNextItem({ state, commit, dispatch, rootState }) {
    state.catPaging = [];

    if (!rootState.helper.isOnSmallScreen) {
      for (let i = 0; i < state.catPageNumber; i++) {
        state.startIndex = state.startIndex + 1 < state.categories.length ? state.startIndex + 1 : 0;
        state.catPaging.push(state.categories[state.startIndex]);
      }
    } else {
      for (let i = 0; i < state.catPageNumberSmallScreen; i++) {
        state.startIndexSmallScreen = state.startIndexSmallScreen + 1 < state.categories.length ? state.startIndexSmallScreen + 1 : 0;
        state.catPaging.push(state.categories[state.startIndexSmallScreen]);
      }
    }
  },

  filterCategory({ state, commit, dispatch, rootState }, category) {
    state.categoriesFilter = [];

    if (category !== '') {
      state.categoriesFilter.push(category);
    }
  }
};

const mutations = { // handle response from actions to update state
  setCategories(state) {
    state.categories = JSON.parse(localStorage.getItem('categories'));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}