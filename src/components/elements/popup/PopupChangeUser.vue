<template>
  <div class="popup-wrapper">
    <div class="popup-type type-change-user" v-if="isActiveChangeUserPopup">
      <div class="popup-heading">
        <h2>Change User</h2>
      </div>
      <div class="popup-error">
        <h3 v-if="isNoTableSelected">Please select table to change user</h3>
        <h3 v-if="isNoUserSelected">Please select user to move table</h3>
      </div>
      <div class="popup-main">
        <div class="main-block">
          <div class="box-list table-list">
            <div class="select-all-box">
              <div class="select-all-text">
                Select all:
              </div>
              <label class="check-input">
                <input type="checkbox" v-model="selectAllTables" @change="toggleSelectAllTables()">
                <span class="checkmark"></span>
              </label>
            </div>
            <div class="list-item"
              v-for="(table, index) in tablesForShow" :key="index"
              @click="selectTableToChangeUser(table)"
              :class="{'is-selected': table.isSelectedChangeUser}">
              <div class="table-name">
                Table {{table.name}}
              </div>
            </div>
          </div>
          <div class="arrow-selector">
            <div class="arrow-btn">
              <span class="icon-arrow-thick-right"></span>
            </div>
          </div>
          <div class="box-list user-list">
            <div class="list-item"
              v-for="(user, index) in usersForShow" :key="index"
              @click="handleClickUserReceiveTable(user)"
              :class="{'is-selected': user.isSelectedMoveTable}">
              {{user.fullname}}
            </div>
          </div>
        </div>
        <div class="btn-confirm-wrap">
          <div class="btn-confirm yes-confirm is-alert" @click="confirmChangeUser()">Done</div>
          <div class="btn-confirm btn-type-1" @click="doResetDataPopup()">Reset</div>
          <div class="btn-confirm no-confirm" @click="closePopup()">Cancel</div>
        </div>
      </div>
    </div>

    <div class="loading-box popup-loading" v-if="isLoadingPopupChangeUser">
      <div class="loading-box-wrap">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="btn-wrap">
        <div class="btn-box" @click="cancelChangeUser()">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import eventBus from '@/eventBus/eventBus.js'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        tablesSelecletedToChange: [],
        selectAllTables: false,
        isNoTableSelected: false,
        isNoUserSelected: false
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        isActiveChangeUserPopup: state => state.order.isActiveChangeUserPopup,
        tablesToChangeUser: state => state.tableFunction.tablesToChangeUser,
        usersReceiveTable: state => state.tableFunction.usersReceiveTable,
        isLoadingPopupChangeUser: state => state.helper.isLoadingPopupChangeUser,
        orderSelected: state => state.order.orderSelected
      }),

      tablesForShow() {
        return this.tablesToChangeUser
      },

      usersForShow() {
        return this.usersReceiveTable
      }
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
      },

      selectTableToChangeUser(paramTable) {
        let isExistTable = false;

        for (let i = 0; i < this.tablesSelecletedToChange.length; i++) {
          if (this.tablesSelecletedToChange[i] == paramTable.code) {
            isExistTable = true;
            break;
          }
        }

        if (!isExistTable) {
          this.tablesSelecletedToChange.push(paramTable.code);
        } else {
          for (let i = 0; i < this.tablesSelecletedToChange.length; i++) {
            if (this.tablesSelecletedToChange[i] == paramTable.code) {
              this.tablesSelecletedToChange.splice(i, 1);
            }
          }
        }

        this.$store.dispatch('tableFunction/handleTableSelectedToChangeUser', this.tablesSelecletedToChange);
        this.$forceUpdate();
      },

      toggleSelectAllTables() {
        this.tablesSelecletedToChange = [];

        if (this.selectAllTables) {
          for (let i = 0; i < this.tablesToChangeUser.length; i++) {
            this.tablesSelecletedToChange.push(this.tablesToChangeUser[i].code);
          }
        }

        this.$store.dispatch('tableFunction/handleTableSelectedToChangeUser', this.tablesSelecletedToChange);
      },

      handleClickUserReceiveTable(paramUser) {
        this.$store.dispatch('tableFunction/handleSelectUserReceiveTable', paramUser);
        this.$forceUpdate();
      },

      doResetDataPopup() {
        this.tablesSelecletedToChange = [];
        this.selectAllTables = false;
        this.isNoTableSelected = false;
        this.isNoUserSelected = false;

        this.$store.dispatch('tableFunction/handleTableSelectedToChangeUser', this.tablesSelecletedToChange);
        this.$store.dispatch('tableFunction/handleSelectUserReceiveTable', {});
        this.$forceUpdate();
      },
      
      confirmChangeUser() {
        this.isNoTableSelected = false;
        this.isNoUserSelected = false;

        for (let i = 0; i < this.tablesForShow.length; i++) {
          if (this.tablesForShow[i].isSelectedChangeUser) {
            this.isNoTableSelected = false;
            break;
          } else {
            this.isNoTableSelected = true;
          }
        }
        if (this.isNoTableSelected) {
          return;
        }

        for (let i = 0; i < this.usersForShow.length; i++) {
          if (this.usersForShow[i].isSelectedMoveTable) {
            this.isNoUserSelected = false;
            break;
          } else {
            this.isNoUserSelected = true;
          }
        }
        if (this.isNoUserSelected) {
          return;
        }

        let dataChangeUser = {};
        let tableToMove = [];
        let userTarget = '';

        for (let i = 0; i < this.tablesForShow.length; i++) {
          if (this.tablesForShow[i].isSelectedChangeUser) {
            tableToMove.push(this.tablesForShow[i].code);
          }
        }

        for (let i = 0; i < this.usersForShow.length; i++) {
          if (this.usersForShow[i].isSelectedMoveTable) {
            userTarget = this.usersForShow[i].username
          }
        }

        dataChangeUser.userOrigin = this.orderSelected.userCode;
        dataChangeUser.userTarget = userTarget;
        dataChangeUser.tableToMove = tableToMove;

        this.$socket.emit('CONFIRM_CHANGE_USER', dataChangeUser);
      },

      cancelChangeUser() {
        this.$socket.emit('CANCEL_CHANGE_USER', '');
      }
    },

    created() {
      eventBus.$on('resetDataChangeUser', $event => {
        this.doResetDataPopup();
      });
    },
  };
</script>

<style>

</style>
