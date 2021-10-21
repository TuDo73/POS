import Vue from 'vue'
import Vuex from 'vuex'

import i18n from './modules/i18n'
import table from './modules/table'
import order from './modules/order'
import product from './modules/product'
import category from './modules/category'
import helper from './modules/helper'
import popup from './modules/popup'
import numboardHome from './modules/numboardHome'
import payment from './modules/payment'
import user from './modules/user'
import company from './modules/company'
import sessionUser from './modules/sessionUser'
import sessionOrder from './modules/sessionOrder'
import tableFunction from './modules/tableFunction'
import listOrder from './modules/listOrder'
import compareOrder from './modules/compareOrder'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    i18n,
    table,
    order,
    product,
    category,
    helper,
    popup,
    numboardHome,
    payment,
    user,
    company,
    sessionUser,
    sessionOrder,
    tableFunction,
    listOrder,
    compareOrder
  },
})
