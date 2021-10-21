<template>
  <div class="body-wrapper">
    <Header/>
    <main>
      <div class="container">
        <div class="container-with-header home-content" v-if="!isOnSmallScreen">
          <div class="home-col home-col-left">
            <div class="home-top">
              <OrderBox/>
              <FunctionButtons/>
            </div>
            <div class="home-bottom">
              <Navigation/>
              <CategoryBox/>
            </div>
          </div>
          <div class="home-col home-col-right">
            <HomeNumpad/>
            <NavBar/>
          </div>
        </div>

        <div class="main-smallscreen" v-if="isOnSmallScreen">
          <OrderBox/>
          <div class="tab-wrapper">
            <div class="change-tab-bar">
              <div class="tab-item left-btn" :class="{'is-active': tabActive === 'numpad'}" @click="changeTabView('numpad')">
                Number Input
              </div>
              <div class="tab-item mid-btn" :class="{'is-active': tabActive === 'menu'}" @click="changeTabView('menu')">
                Menu View
              </div>
              <div class="tab-item right-btn" :class="{'is-active': tabActive === 'function'}" @click="changeTabView('function')">
                Functions
              </div>
            </div>
            <HomeNumpad v-if="tabActive === 'numpad'" />
            <CategoryBox v-if="tabActive === 'menu'" />
            <FunctionButtons v-if="tabActive === 'function'" />
          </div>
          <NavBar/>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue'
  import OrderBox from '@/components/OrderBox.vue'
  import FunctionButtons from '@/components/FunctionButtons.vue'
  import CategoryBox from '@/components/CategoryBox.vue'
  import NavBar from '@/components/NavBar.vue'
  import HomeNumpad from '@/components/HomeNumpad.vue'
  import Navigation from '@/components/Navigation.vue'
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import UserDataService from '@/mixins/UserDataService'
  import OrdersDataService from '@/mixins/OrdersDataService'
  import TableService from '@/services/TableService'
  import OrderService from '@/services/OrderService'

  export default {
    mixins: [
      UserDataService,
      OrdersDataService
    ],

    components: {
      'Header': Header,
      'OrderBox': OrderBox,
      'FunctionButtons': FunctionButtons,
      'CategoryBox': CategoryBox,
      'NavBar': NavBar,
      'HomeNumpad': HomeNumpad,
      'Navigation': Navigation
    },

    computed: {
      ...mapState({
        allTablesData: state => state.table.allTablesData,
        user: state => state.user.user,
        users: state => state.user.users,
        tableOrdered: state => state.table.tableOrdered,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        isGetOrdersFinished: state => state.helper.isGetOrdersFinished
      })
    },

    watch: {
      isGetOrdersFinished() {
        if(this.isGetOrdersFinished) {
          this.$store.commit('helper/showLoading', true);
          OrderService.getRefOrder(this.user.username).then((refOrderResp) => {
            let refNumber = refOrderResp[0].ref;

            this.$store.dispatch('order/initOrder', refNumber);
            this.$store.commit('helper/showLoading', false);
          });
        }
      }
    },

    data() {
      return {
        tabActive: 'numpad'
      }
    },

    methods: {
      getData() {
        this.$store.commit('helper/showLoading', true);

        TableService.getAll().then(() => {
          this.$store.commit('helper/showLoading', false);
        });

        if(!this.users.length) {
          let usersLS = localStorage.getItem('users');

          usersLS = JSON.parse(usersLS);
          this.$store.commit('user/setUsers', usersLS);
        }

        if(!globalFunction.checkValid(this.tableOrdered.code)) {
          let tableLS = localStorage.getItem('tableOrdered');

          tableLS = JSON.parse(tableLS);
          this.$store.commit('table/setTableOrdered', tableLS);
        }
      },

      changeTabView(val) {
        this.tabActive = val;
      }
    },

    created() {
      this.getData();
      this.$store.commit('product/setProducts');
      this.$store.commit('product/setExtras');
      this.$store.commit('product/setDataProductLazyLoad', JSON.parse(localStorage.getItem('products')));
      this.$store.commit('helper/setStateDiscountLocation', '');
      this.$store.dispatch('helper/hideAllKeyboard');
      this.$store.commit('order/setReasonStornoAll', '');
    },
  }
</script>

<style lang="scss">
</style>