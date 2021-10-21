import { globalFunction } from '@/global/global.js';

const state = { // data
  products: [],
  productsForFilter: [],
  allProductLazyLoad: [],
  productsPerPage: 15,
  currentProductScrollTo: 0,
  extras: [],
  pagingProduct: 1
};
const getters = { // computed

};

const actions = { // methods
  handleProductDataWhenScroll({commit, state, dispatch, rootState}, direction) {
    switch (direction) {
      case 'down':
        if (state.productsForFilter.length >= state.productsPerPage) {
          if(state.currentProductScrollTo < state.productsForFilter.length - state.productsPerPage) {
            state.currentProductScrollTo += state.productsPerPage;
          }

          let l = state.allProductLazyLoad.length;

          state.allProductLazyLoad = [...state.allProductLazyLoad, ...state.productsForFilter.slice(l, l + state.productsPerPage)];
          state.pagingProduct = Math.ceil(Number((state.currentProductScrollTo + state.productsPerPage) / state.productsPerPage));

          setTimeout(() => {
            globalFunction.scrollToElement('products-box', 'product-item', state.currentProductScrollTo);
          }, 100);
        }
        break;
      case 'up':
        state.currentProductScrollTo -= state.productsPerPage;

        if(state.currentProductScrollTo <= 0) {
          state.currentProductScrollTo = 0;
        }
        state.pagingProduct = Math.ceil(Number((state.currentProductScrollTo + state.productsPerPage) / state.productsPerPage));

        globalFunction.scrollToElement('products-box', 'product-item', state.currentProductScrollTo);
        break;
      default:
        break;
    }
  },

  searchProduct({commit, state, dispatch, rootState}, [searchValue]) {
    state.productsForFilter = [];

    searchValue = searchValue.toString().toLowerCase();

    if(searchValue == '') {
      state.currentProductScrollTo = 0;
      state.productsForFilter = [...state.products];
    } else {
      for(let i = 0; i < state.products.length; i++) {
        if(state.products[i].nameForSearch.indexOf(searchValue) !== -1) {
          state.productsForFilter.push(state.products[i]);
        }
      }
    }

    commit('setDataProductLazyLoad', state.productsForFilter);
  },

  filterProductByCategory({commit, state, dispatch, rootState}, category) {
    state.productsForFilter = [];
    state.currentProductScrollTo = 0;
    if(category == '') {
      state.productsForFilter = [...state.products];
    } else {
      for(let i = 0; i < state.products.length; i++) {
        if(state.products[i].category_code == category.code) {
          state.productsForFilter.push(state.products[i]);
        }
      }
    }

    dispatch('category/filterCategory', category, {root: true});
    commit('setDataProductLazyLoad', state.productsForFilter);
  }
};

const mutations = { // handle response from actions to update state
  setProducts(state) {
    state.products = JSON.parse(localStorage.getItem('products'));

    state.productsForFilter = [...state.products];
  },

  setExtras(state) {
    state.extras = JSON.parse(localStorage.getItem('extras'));
  },

  setDataProductLazyLoad(state, allProduct) {
    let tmpProductsPerPage = state.productsPerPage;

    state.allProductLazyLoad = [];

    if(allProduct.length < state.productsPerPage) {
      tmpProductsPerPage = allProduct.length;
    } else {
      tmpProductsPerPage = state.productsPerPage;
    }

    for (let i = 0; i < tmpProductsPerPage; i++) {
      state.allProductLazyLoad.push(allProduct[i]);
    }
  },

  setPagingProduct(state, value) {
    state.pagingProduct = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}