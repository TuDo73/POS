import { globalFunction } from '@/global/global.js';
import router from '@/router'

const state = { // data
  allTablesData: [],
  areas: [],

  areaColors: [
    { 'areaColor': '#F49595' },
    { 'areaColor': '#82E9AB' },
    { 'areaColor': '#8889F2' },
    { 'areaColor': '#FFD688' }
  ],
  tableColors: [
    { 'tableColor': '#EE4040' },
    { 'tableColor': '#53bb53' },
    { 'tableColor': '#0064FF' },
    { 'tableColor': '#f1c433' }
  ],

  tables: [], // bàn trong 1 khung area
  tableSelected: {},
  areaSelected: {},

  isEditTable: false,
  numNewTable: 1,
  isOpenAreaColor: false,
  isOpenTableColor: false,
  isDisableBtn: true,
  areaBgColor: '',
  numNewArea: 1,
  typeChangeText: '',
  textInputData: '',

  isActiveChangeTextPopup: false,
  isActiveRemoveAreaPopup: false,
  isActiveTogo: false,
  tableOrdered: {},
  isOpen: true,
  tableForSearch: {},
  searchInput: '',
  refOrderTogoSelected: ''
};

const getters = { // computed
};

const actions = { // methods
  resize({state}, [newRect, index]) {
    state.tables[index].width = newRect.width;
    state.tables[index].height = newRect.height;
    state.tables[index].top = newRect.top;
    state.tables[index].left = newRect.left;
  },

  onDragstop({state}, newRect) {
    // console.log('onDragstop:', newRect);
    // Nếu chưa chọn table thì không thể nào drag-drop được
    if(typeof state.tableSelected.active === "undefined"){
      return;
    }

    //------- request API
    let link = globalFunction.baseUrl + 'table/add';
    globalFunction.request(link, state.tableSelected);
  },

  onActiveTable({state, dispatch}, index) {
    // console.log('onActiveTable index:', index);
    state.isDisableBtn = false;

    for (let i = 0; i < state.tables.length; i++) {
      if (i === index) {
        state.tables[i].active = true;
        state.tableSelected = state.tables[i];
        continue;
      }

      state.tables[i].active = false;
    }

    state.isOpenAreaColor = false;
  },

  onDeactiveTable({state}, index) { // luôn run khi trạng thái active của bàn bị thay đổi
    // console.log('onDeactiveTable index:', index);
    state.tables[index].active = false;
    state.isOpenTableColor = false;
  },

  doDeactive({state}) {
    // console.log('isDeactive');
    state.tableSelected = {};
    state.isOpenAreaColor = false;
    state.isDisableBtn = true;

  },

  editTable({state}) {
    state.isEditTable = !state.isEditTable;

    if (state.isEditTable === false) {
      state.tableSelected = {};

      for (let i = 0; i < state.tables.length; i++) {
        state.tables[i].active = false;
      }

      state.isDisableBtn = true;
      state.isOpenAreaColor = false;
      state.isOpenTableColor = false;
    }
  },

  addNewTable({state}) {
    if (state.isEditTable) {
      let table = { 'code': 0, 'name': 'Table 0', 'areaCode': 0, 'width': 130, 'height': 130, 'left': 0, 'top': 350, 'active': true, 'type': 'square', 'color': '#53bb53', 'isbusy': false, 'totalprice': 0, 'username': '', 'isTogo': false};
      let newTable = globalFunction.deepCloneObj(table);
      let maxCode = 0;

      for (let area of state.areas) {
        if (area.active) {
          newTable.areaCode = area.code;
        }
      }

      state.allTablesData.map((table) => {
        if (table.code > maxCode) maxCode = table.code;
      });

      newTable.code = maxCode + 1;
      // newTable.name = `${state.numNewTable}`;
      newTable.name = 'New';
      state.tables.push(newTable);
      state.allTablesData.push(newTable);
      state.tableSelected = newTable;
      state.numNewTable++;

      //------- request API
      let link = globalFunction.baseUrl + 'table/add';
      globalFunction.request(link, newTable);
      globalFunction.stringForSearch(state.allTablesData);

      for (let i = 0; i < state.tables.length; i++) {
        if (state.tables[i].code !== newTable.code) {
          state.tables[i].active = false;
        }
      }

      state.isOpenAreaColor = false;
      state.isOpenTableColor = false;
    }

    state.isDisableBtn = false;  },

  copyTable({state}) {
    if (globalFunction.checkValid(state.tableSelected.code)) {
      let codeTableSelected = state.tableSelected.code;
      let tableCopied = globalFunction.deepCloneObj(state.tableSelected);
      let maxCode = 0;

      state.allTablesData.map((table) => {
        if (table.code > maxCode) maxCode = table.code;
      });

      tableCopied.code = maxCode + 1;
      tableCopied.name = `${state.tableSelected.name} - Copy`;
      tableCopied.top = state.tableSelected.top + 20;
      tableCopied.left = state.tableSelected.left + 20;
      tableCopied.active = true;

      state.tables.push(tableCopied);
      state.allTablesData.push(tableCopied);
      state.tableSelected = tableCopied;

      //------- request API
      let link = globalFunction.baseUrl + 'table/add';
      globalFunction.request(link, tableCopied);

      for (let i = 0; i < state.tables.length; i++) {
        if (state.tables[i].code === codeTableSelected) {
          state.tables[i].active = false;
        }
      }

      state.isOpenTableColor = false;
    }
  },

  changeShapeTable({state}) {
    if (globalFunction.checkValid(state.tableSelected.code)) {
      let shapeTable = state.tableSelected.type;
      let tableActive = document.querySelector('.active').getElementsByClassName('table')[0];

      if (shapeTable === 'square') {
        state.tableSelected.type = 'circle';
        tableActive.classList.add('circle');
      } else {
        state.tableSelected.type = 'square';
        tableActive.classList.remove('circle');
      }

      //------- request API
      let link = globalFunction.baseUrl + 'table/add';
      globalFunction.request(link, state.tableSelected);
    }

    state.isOpenTableColor = false;
  },

  deleteTable({state}) {
    if (globalFunction.checkValid(state.tableSelected.code)) {
      let allTableAfterRemove = globalFunction.removeObj(state.tables, true);
      state.tables = allTableAfterRemove;

      for (let i = 0; i < state.allTablesData.length; i++) {
        if (state.allTablesData[i].active === true) {
          state.allTablesData.splice(i, 1);
        }
      }

      //------- request API
      let link = globalFunction.baseUrl + 'table/remove';
      let data = {'code': state.tableSelected.code};
      globalFunction.request(link, data);
    }

    state.tableSelected = {};
    state.isDisableBtn = true;
    state.isOpenTableColor = false;
  },

  deleteArea({state, dispatch}) {
    // xóa tables nằm trong area deleted
    for (let area of state.areas) {
      if (area.active) {
        let codeAreaRemove = area.code;
        let allTableDataAfterRemove = globalFunction.removeObj(state.allTablesData, codeAreaRemove, false);

        for (let table of state.allTablesData) {
          if (table.areaCode === codeAreaRemove) {
            //------- request API
            let linkTable = globalFunction.baseUrl + 'table/remove';
            let dataTable = {'code': table.code};
            globalFunction.request(linkTable, dataTable);
          }
        }

        state.allTablesData = allTableDataAfterRemove;
        state.tables = [];

        //------- request API
        let linkArea = globalFunction.baseUrl + 'area/remove';
        let dataArea = {'code': area.code};
        globalFunction.request(linkArea, dataArea);
      }
    }
    // remove area
    let allAreaAfterRemove = globalFunction.removeObj(state.areas, true);
    state.areas = allAreaAfterRemove;

    dispatch('selectArea', state.areas.length - 1);

    dispatch('popup/updatePopupState', false, { root: true });
    state.isActiveRemoveAreaPopup = false;
  },

  openAreaColor({state}) {
    state.isDisableBtn = true;
    state.isOpenAreaColor = true;
    state.isOpenTableColor = false;
    state.tableSelected = {};

    for (let table of state.tables) {
      table.active = false;
    }
  },

  openTableColor({state}) {
    if (globalFunction.checkValid(state.tableSelected.code)) {
      state.isOpenTableColor = true;
      state.isOpenAreaColor = false
    }
  },

  changeColor({state}, index) {
    if (globalFunction.checkValid(state.tableSelected.code)) {
      let tableColor = state.tableColors[index].tableColor;

      state.tableSelected.color = tableColor;

      //------- request API
      let link = globalFunction.baseUrl + 'table/add';
      globalFunction.request(link, state.tableSelected);
    } else {
      let bgColorIndex = state.areaColors[index].areaColor;

      for (let item of state.areas) {
        if (item.active) {
          item.bgColor = bgColorIndex;
          state.areaBgColor = item.bgColor;

          //------- request API
          let link = globalFunction.baseUrl + 'area/add';
          globalFunction.request(link, item);
        }
      }
    }
  },

  closeColorBox({state}) {
    state.isOpenAreaColor = false;
    state.isOpenTableColor = false;
  },

  selectArea({state}, index) {
    state.isActiveTogo = false;
    state.tableSelected = {};
    state.areaBgColor = state.areas[index].bgColor;
    state.isEditTable = false;
    state.isDisableBtn = true;

    for (let area of state.areas) {
      area.active = false;
    }

    state.areas[index].active = true;
    state.areaSelected = state.areas[index];

    state.tables = state.allTablesData.filter((table) => {
      if (table.areaCode === state.areas[index].code) {
        return table;
      }
    });

    state.isOpenAreaColor = false;
    state.isOpenTableColor = false;
    state.tableForSearch = {};
    state.searchInput = '';
  },

  addMoreArea({state, dispatch}) {
    if (state.areas.length < 6 && state.isActiveTogo == false) {
      let area = { 'code': 0, 'name': 'New Area', 'active': false, 'bgColor': '#a6a6a6' };
      let newArea = globalFunction.deepCloneObj(area);
      let maxCode = 0;

      state.areas.map((item) => {
        if (item.code > maxCode) maxCode = item.code;
      });

      newArea.code = maxCode + 1;
      state.areas.push(newArea);

      //------- request API
      let link = globalFunction.baseUrl + 'area/add';
      globalFunction.request(link, newArea);

      dispatch('selectArea', state.areas.length - 1);
    }
  },

  showHidePopupDeleteArea({commit, state, dispatch}, value) {
    if(value) {
      if (state.areas.length > 1) {
        dispatch('popup/updatePopupState', value, {root: true});
        state.isActiveRemoveAreaPopup = value;
      }
    }else {
      state.isActiveRemoveAreaPopup = value;
      state.tableSelected = {};
      state.isDisableBtn = true;
    }
  },

  showHidePopupChangeText({commit, state, dispatch}, value) {
    if(value) {
      if(globalFunction.checkValid(state.tableSelected.code) && state.typeChangeText == 'table') {
        dispatch('popup/updatePopupState', value, {root: true});
        state.isActiveChangeTextPopup = value;
        state.textInputData = '';
      }

      if(state.typeChangeText == 'area') {
        dispatch('popup/updatePopupState', value, {root: true});
        state.isActiveChangeTextPopup = value;
        state.textInputData = '';
      }
    }else {
      state.isActiveChangeTextPopup = value;
      for(let table of state.allTablesData) {
        table.active = false;
      }
    }
  },

  changeText({commit, state, dispatch}) {
    if(state.typeChangeText == 'table') {
      for (let table of state.allTablesData) {
        if (state.textInputData === table.name) {
          dispatch('popup/updatePopupChangeTextError', true, { root: true });
          state.isActiveChangeTextPopup = false;
          return;
        }
      }

      state.tableSelected.name = state.textInputData;
      dispatch('popup/updatePopupState', false, { root: true });
      state.isActiveChangeTextPopup = false;

      //------- request API
      let link = globalFunction.baseUrl + 'table/add';
      globalFunction.request(link, state.tableSelected);

      globalFunction.stringForSearch(state.allTablesData);
    }

    if(state.typeChangeText == 'area') {
      state.areaSelected.name = state.textInputData;
      dispatch('popup/updatePopupState', false, { root: true });
      state.isActiveChangeTextPopup = false;

      //------- request API
      let link = globalFunction.baseUrl + 'area/add';
      globalFunction.request(link, state.areaSelected);
    }
  },

  openTogo({state}) {
    state.isActiveTogo = true;

    for (let area of state.areas) {
      area.active = false;
    }
  },

  searchTable({commit, state, dispatch}, [searchValue]) {
    state.tableForSearch = {};

    searchValue = searchValue.toString().toLowerCase();

    if (searchValue == '') {
      state.tableForSearch = {};
    } else {
      for (let table of state.allTablesData) {
        if (searchValue === table.nameForSearch) {
          state.tableForSearch = table;
          state.tableForSearch.searchActive = true;
        }
      }
    }
  },

  clickNumBtn({commit, state, dispatch, rootState}, val) {
    if (val === 'delete') {
      state.searchInput = '';
      dispatch('searchTable', [state.searchInput]);
      return;
    }
    if (val === 'enter') {
      if (state.searchInput !== '') {
        if (!state.tableForSearch.searchActive) { // check bàn đã có hay chưa
          dispatch('popup/updatePopupState', true, { root: true });
          dispatch('popup/updatePopupTableNotAvailable', true, { root: true });
          return;
        }

        let userName = rootState.user.user.username;
        let fullName = rootState.user.user.fullname;

        dispatch('selectTable', [state.tableForSearch, userName, fullName]);
      }
      return;
    }
    if (state.searchInput === '') {
      if (val !== '0') {
        state.searchInput += val;
        dispatch('searchTable', [state.searchInput]);
      }
    } else {
      state.searchInput += val;
      dispatch('searchTable', [state.searchInput]);
    }
  },

  async selectTable({commit, state, dispatch}, [table, userName, fullName, isGoToHome = true]) {
    commit('helper/showLoading', true, { root: true });

    if(table.isTogo) { // trường hợp là order to-go
      router.push({ path: 'home' });
      commit('setTableOrdered', table);
    } else { // trường hợp là ăn tại quán
      if (!table.isbusy) {
        let tableTmp = {...table};
        let dataTableUser = {};
  
        tableTmp.isbusy = true;
        tableTmp.username = userName;
  
        let link = globalFunction.baseUrl + 'table/add';
        let tableResponse = await globalFunction.request(link, tableTmp);
  
        commit('helper/showLoading', false, { root: true });
        dataTableUser.tableCode = table.code;
        dataTableUser.userName = userName;
        dataTableUser.userFullName = fullName;
        dataTableUser.totalPrice = 0;
        this._vm.$socket.emit('SELECT_TABLE', dataTableUser);
  
        if (isGoToHome) {
          router.push({ path: 'home' });
          commit('setTableOrdered', table);
        }
      } else {
        if (table.username == userName) {
          router.push({ path: 'home' });
          commit('setTableOrdered', table);
        } else {
          dispatch('popup/updatePopupState', true, { root: true });
          dispatch('popup/updatePopupTableBusy', true, { root: true });
        }
      }
    }

    commit('helper/showLoading', false, { root: true });
  }

};

const mutations = { // handle response from actions to update state
  setDataArea(state, allArea) {
    state.areas = allArea;
  },

  setDataTable(state, allTable) {
    state.allTablesData = allTable;
  },

  setNumNewTableDefault(state) {
    state.numNewTable = 1;
  },

  setTableActiveDefault(state) {
    for (let table of state.allTablesData) {
      table.active = false;
    }
  },

  setTypeChangeText(state, type) {
    state.typeChangeText = type;
  },

  updateChangeTextInput(state, value) {
    state.textInputData = value;
  },

  setTableOrdered(state, table) {
    state.tableOrdered = table;
    // console.log(state.tableOrdered);
    globalFunction.storeToLocalStorage('tableOrdered', table);
  },

  setIsOpen(state, val) {
    state.isOpen = val;
  },

  setValueRefOrderTogoSelected(state, value) {
    state.refOrderTogoSelected = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}