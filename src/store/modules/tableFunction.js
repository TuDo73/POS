import { globalFunction } from '@/global/global.js';

const state = { // data
  tablesToMove: [],
  userMoveDishTarget: '',
  tableMoveDishTarget: '',
  dataMoveDishSocket: {},
  tablesToChangeUser: [],
  usersReceiveTable: [],
  dataChangeUserSocket: {},
  userChangeTableOrigin: {},
  userChangeTableTarget: {},
  ordersToChangeUser: []
};

const getters = { // computed
};

const actions = { // methods
  handleListTablesToMove({commit, state, dispatch, rootState}, tableSelected) {
    let tablesTmp = [...rootState.table.allTablesData];

    state.tablesToMove = [];
    for (let table of tablesTmp) {
      if (table.code !== tableSelected.code && !table.isTogo) {
        state.tablesToMove.push(table);
      }
    }
  },

  handleTablesToChangeUser({commit, state, dispatch, rootState}, userName) {
    let tablesTmp = [...rootState.table.allTablesData];

    state.tablesToChangeUser = [];
    for (let table of tablesTmp) {
      if (table.username == userName && !table.isTogo) {
        state.tablesToChangeUser.push(table);
      }
    }
  },

  handleUsersReceiveTable({commit, state, dispatch, rootState}, userName) {
    let usersTmp = [...rootState.user.users];

    state.usersReceiveTable = [];
    for (let user of usersTmp) {
      if (user.usergroup == 'kassier' && user.username !== userName) {
        state.usersReceiveTable.push(user);
      }
    }
  },

  handleTableSelectedToChangeUser({commit, state, dispatch, rootState}, tablesSelected) {
    let obj = {};

    for (let i = 0; i < tablesSelected.length; i++) {
      obj[tablesSelected[i]] = 1;
    }

    for (let i = 0; i < state.tablesToChangeUser.length; i++) {
      if (obj[state.tablesToChangeUser[i].code]) {
        state.tablesToChangeUser[i].isSelectedChangeUser = true;
      } else {
        state.tablesToChangeUser[i].isSelectedChangeUser = false;
      }
    }
  },
  
  handleSelectUserReceiveTable({commit, state, dispatch, rootState}, userSelected) {
    for (let i = 0; i < state.usersReceiveTable.length; i++) {
      if (state.usersReceiveTable[i].username == userSelected.username) {
        state.usersReceiveTable[i].isSelectedMoveTable = true;
      } else {
        state.usersReceiveTable[i].isSelectedMoveTable = false;
      }
    }
  },
};

const mutations = { // handle response from actions to update state
  setUserMoveDishTarget(state, val) {
    state.userMoveDishTarget = val;
  },

  setTableMoveDishTarget(state, val) {
    state.tableMoveDishTarget = val;
  },

  setDataMoveDishSocket(state, val) {
    state.dataMoveDishSocket = globalFunction.deepCloneObj(val);
  },

  setDataChangeUserSocket(state, val) {
    state.dataChangeUserSocket = globalFunction.deepCloneObj(val);
  },

  setUserChangeTableOrigin(state, val) {
    state.userChangeTableOrigin = globalFunction.deepCloneObj(val);
  },

  setUserChangeTableTarget(state, val) {
    state.userChangeTableTarget = globalFunction.deepCloneObj(val);
  },

  setOrdersToChangeUser(state, val) {
    state.ordersToChangeUser = globalFunction.deepCloneObj(val);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}