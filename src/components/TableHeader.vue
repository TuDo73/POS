<template>
  <div class="table-header">
    <div class="table-header-top">
      <div class="log-out-btn" v-if="user.usergroup != 'chef'" @click="logout()">
          <span class="icon-logout-2"></span>
        </div>
        <div class="routing-btn-box" v-if="user.usergroup == 'chef'" @click="backToBericht()">
          <span class="icon-cheveron-left"></span>
          <span>Back</span>
        </div>
        <div class="table-plan-heading">Table plan</div>
        <div class="box-wrap">
          <div class="menu-button" @click="showHideMenuHeader()">
            <span class="icon-servers"></span>
            <ul class="list-menu" v-if="isShowMenu">
              <!-- <li class="list-menu-item">
                <span class="icon-show-sidebar"></span>
                <span class="title">
                  Selling list
                </span>
              </li> -->
              <li class="list-menu-item" @click="goToListOrdered()">
                <span class="icon-queue"></span>
                <span class="title">
                  Verkauflist
                </span>
              </li>
              <li class="list-menu-item" @click="showHidePopupPasswordAdminUmsatz()">
                <span class="icon-star-full"></span>
                <span class="title">
                  Umsatz
                </span>
              </li>
              <li class="list-menu-item" @click="showHidePopupPasswordAdminRetour()">
                <span class="icon-station"></span>
                <span class="title">
                  Retour
                </span>
              </li>
            </ul>
          </div>
          <div class="user-info">
            <span>
              {{user.fullname}}
            </span>
          </div>
          <div class="close-session-btn" @click="closeSession()">
            <span v-if="!isOnSmallScreen">Abschluss</span>
            <span class="icon-close-outline"v-if="isOnSmallScreen"></span>
          </div>
        </div>
    </div>
    <div class="area-selector">
      <div class="selector-wrap" v-for="(area, index) in areas.slice(0, 6)" 
        :key="index" 
        @click="selectArea(index)" 
        :class="{'area-active': area.active}">
        <div class="area-btn">
          {{area.name}}
        </div>
      </div>
      <div class="selector-wrap large-type" v-if="user.usergroup == 'chef' && !isOnSmallScreen">
        <div class="area-btn add-more-area" 
          :class="[areas.length == 6 ? 'disable' : '']" 
          @click="addMoreArea()">
          <span class="icon-add-outline"></span>
        </div>
      </div>
      <div class="selector-wrap large-type">
        <div class="area-btn to-go-btn" :class="{'is-active': isActiveTogo}" @click="openTogo()">to-go</div>
      </div>
    </div>

    <div class="edit-table" v-if="user.usergroup == 'chef' && !isActiveTogo && !isOnSmallScreen" @mousedown.stop>
      <div class="edit-table-btn" @click="editTable()" :class="{'is-actived': isEditTable}">
        <span class="icon-edit-2"></span>
      </div>
      <div class="edit-table-list-btn" v-if="isEditTable">
        <div class="btn" @click="addNewTable()">
          <span>Add New</span>
        </div>
        <div class="btn" :class="{disable: isDisableBtn}" @click="copyTable()">
          <span>Copy</span>
        </div>
        <div class="btn" @click="changeTextArea()">
          <span>Text Area</span>
        </div>
        <div class="btn" :class="{disable: isDisableBtn}" @click="changeTextTable()">
          <span>Text Table</span>
        </div>
        <div class="btn" :class="{disable: isDisableBtn}">
          <span>People</span>
        </div>
        <div class="btn btn-color" @click="openAreaColor()">
          <span>Color Area</span>
          <div class="color-box bg-color" v-if="isOpenAreaColor">
            <div class="close-color-box" @click.stop="closeColorBox()">
              <span class="icon-close"></span>
            </div>
            <div v-for="(item, index) in areaColors" 
              :key="index" 
              class="color" 
              :style="{background: item.areaColor}"
              @click="changeColor(index)">
            </div>
          </div>
        </div>
        <div class="btn btn-color" :class="{disable: isDisableBtn}" @click="openTableColor()">
          <span>Color Table</span>
          <div class="color-box table-color" v-if="isOpenTableColor">
            <div class="close-color-box" @click.stop="closeColorBox()">
              <span class="icon-close"></span>
            </div>
            <div v-for="(item, index) in tableColors" 
              :key="index" 
              class="color" 
              :style="{background: item.tableColor}"
              @click="changeColor(index)">
            </div>
          </div>
        </div>
        <div class="btn" :class="{disable: isDisableBtn}" @click="changeShapeTable()">
          <span>Shape</span>
        </div>
        <div class="btn" :class="[areas.length > 1 ? '' : 'disable']" @click="deleteArea()">
          <span>Delete Area</span>
        </div>
        <div class="btn" :class="{disable: isDisableBtn}" @click="deleteTable()">
          <span>Delete Table</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  
  export default {
    data() {
      return {
        isShowMenu: false
      };
    },

    computed: {
      ...mapState({
        areas: state => state.table.areas,
        isActiveTogo: state => state.table.isActiveTogo,
        isEditTable: state => state.table.isEditTable,
        isDisableBtn: state => state.table.isDisableBtn,
        tableColors: state => state.table.tableColors,
        areaColors: state => state.table.areaColors,
        isOpenAreaColor: state => state.table.isOpenAreaColor,
        isOpenTableColor: state => state.table.isOpenTableColor,
        user: state => state.user.user,
        isOnSmallScreen: state => state.helper.isOnSmallScreen
      })
    },

    methods: {
      logout(){
        this.$store.dispatch('user/logout');
      },

      backToBericht() {
        this.$router.push({ path: '/bericht' });
      },
      
      editTable() {
        this.$store.dispatch('table/editTable');
      },

      addNewTable() {
        this.$store.dispatch('table/addNewTable');
      },

      copyTable() {
        this.$store.dispatch('table/copyTable');
      },

      changeTextArea() {
        this.$store.commit('table/setTypeChangeText', 'area');
        this.$store.dispatch('table/showHidePopupChangeText', true);
      },

      changeTextTable() {
        this.$store.commit('table/setTypeChangeText', 'table');
        this.$store.dispatch('table/showHidePopupChangeText', true);
      },

      changeShapeTable() {
        this.$store.dispatch('table/changeShapeTable');
      },

      deleteTable() {
        this.$store.dispatch('table/deleteTable');
      },

      deleteArea() {
        this.$store.dispatch('table/showHidePopupDeleteArea', true);
      },

      openAreaColor() {
        this.$store.dispatch('table/openAreaColor');
      },

      openTableColor() {
        this.$store.dispatch('table/openTableColor');
      },

      changeColor(index) {
        this.$store.dispatch('table/changeColor', index);
      },

      closeColorBox() {
        this.$store.dispatch('table/closeColorBox');
      },

      selectArea(index) {
        this.$store.dispatch('table/selectArea', index);
      },

      addMoreArea() {
        this.$store.dispatch('table/addMoreArea');
      },

      openTogo() {
        this.$store.dispatch('table/openTogo');
      },

      closeSession() {
        this.$store.dispatch('popup/updatePopupState', true);
        this.$store.dispatch('popup/updatePopupConfirmCloseSession', true);
      },

      goToListOrdered() {
        this.$router.push({ path: 'list-ordered', query: { type: 'verkaufs' } });
      },

      showHideMenuHeader() {
        this.isShowMenu = !this.isShowMenu;
      },

      showHidePopupPasswordAdminRetour() {
        this.$store.dispatch('popup/updatePopupState', true);
        this.$store.dispatch('popup/updatePopupPasswordAdminRetour', true);
      },

      showHidePopupPasswordAdminUmsatz() {
        this.$store.dispatch('popup/updatePopupState', true);
        this.$store.dispatch('popup/updatePopupPasswordAdminUmsatz', true);
      },
    },

    created() {
    },
  };
</script>

<style>

</style>
