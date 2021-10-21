<template>
  <div class="body-wrapper">
    <div class="table-page" @mousedown="doDeactive()" v-if="!isOnSmallScreen">
      <div class="left-pane">
        <TableHeader/>
        <ToGoBox v-if="isActiveTogo"/>
        <DragArea/>
      </div>
      <div class="right-pane">
        <TableList/>
        <TableNumpad/>
      </div>
    </div>
    
    <div class="table-page-smallscreen" v-if="isOnSmallScreen">
      <TableHeader/>
      <ToGoBox v-if="isActiveTogo"/>
      <DragArea/>
      <div class="tab-wrapper">
        <div class="change-tab-bar">
          <div class="tab-item left-btn" :class="{'is-active': tabActive === 'numpad'}" @click="changeTabView('numpad')">
            Number View
          </div>
          <div class="tab-item right-btn" :class="{'is-active': tabActive === 'table-list'}" @click="changeTabView('table-list')">
            Table List
          </div>
        </div>
        <TableNumpad v-if="tabActive === 'numpad'" />
        <TableList v-if="tabActive === 'table-list'" />
      </div>
    </div>
  </div>
</template>
<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'

  import TableHeader from '@/components/TableHeader.vue';
  import ToGoBox from '@/components/ToGoBox.vue';
  import DragArea from '@/components/DragArea.vue';
  import TableList from '@/components/TableList.vue';
  import TableNumpad from '@/components/TableNumpad.vue';
  import TableService from '@/services/TableService';
  import UserDataService from '@/mixins/UserDataService';
  import OrdersDataService from '@/mixins/OrdersDataService';
  import OrderService from '@/services/OrderService';

  export default {
    mixins: [
      UserDataService,
      OrdersDataService
    ],

    components: {
      'TableHeader': TableHeader,
      'ToGoBox': ToGoBox,
      'DragArea': DragArea,
      'TableList': TableList,
      'TableNumpad': TableNumpad,
    },

    data() {
      return {
        allArea: [],
        allTable: [],
        tabActive: 'numpad'
      }
    },

    computed: {
      ...mapState({
        user: state => state.user.user,
        users: state => state.user.users,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        allTablesData: state => state.table.allTablesData,
        isActiveTogo: state => state.table.isActiveTogo,
      }),
    },

    methods: {
      async getAllArea() {
        this.$store.commit('helper/showLoading', true);
        let link = globalFunction.baseUrl + 'area/getall';
        this.allArea = await globalFunction.request(link);
        this.$store.commit('table/setDataArea', this.allArea);

        if (this.allArea.length > 0 && this.allTablesData.length > 0) {
          this.$store.dispatch('table/selectArea', 0);
        }

        this.$store.commit('helper/showLoading', false);
      },

      getAllTable() {
        this.$store.commit('helper/showLoading', true);

        TableService.getAll().then(() => {
          this.$store.commit('table/setTableActiveDefault');
          globalFunction.stringForSearch(this.allTablesData);
          if(this.allArea.length > 0 && this.allTablesData.length > 0) {
            this.$store.dispatch('table/selectArea', 0);
          }

          this.$store.commit('helper/showLoading', false);
        });
      },

      async getSessionUser() {
        this.$store.commit('helper/showLoading', true);

        let link = globalFunction.baseUrl + 'session/get_by_user';
        let userNameObj = {
          'username': this.user.username
        };

        let sessionUser = await globalFunction.request(link, userNameObj, 'post');
        let sessionUserData = JSON.parse(sessionUser.data);
        this.$store.commit('user/setSessionUser', sessionUserData);
        if(!sessionUserData.length) {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('popup/updatePopupOpenNewSession', true);
        }

        this.$store.commit('helper/showLoading', false);
      },

      doDeactive() {
        this.$store.dispatch('table/doDeactive');
      },

      getUser() {
        if(!globalFunction.checkValid(this.user.username)) {
          let userLS = localStorage.getItem('login');

          userLS = JSON.parse(userLS);
          this.$store.commit('user/setUser', userLS);
        }

        if(!this.users.length) {
          let usersLS = localStorage.getItem('users');

          usersLS = JSON.parse(usersLS);
          this.$store.commit('user/setUsers', usersLS);
        }

        this.getSessionUser();
      },

      changeTabView(val) {
        this.tabActive = val;
      },

      saveOrderRef() {
        this.$store.commit('helper/showLoading', true);
        OrderService.setRefOrder('', this.user.username).then(() => {
          this.$store.commit('helper/showLoading', false);
        });
      }
    },

    created() {
      this.getAllArea();
      this.getAllTable();
      this.$store.commit('table/setNumNewTableDefault');
      this.$store.dispatch('helper/hideAllKeyboard');
      this.getUser();
      this.$store.commit('table/setTableOrdered', {});
      this.$store.commit('table/setValueRefOrderTogoSelected', '');
      this.saveOrderRef();
    },
  };
</script>

<style lang="scss">

</style>