<template>
  <header>
    <div class="header-wrapper" v-if="!isOnSmallScreen">
      <div class="header-col header-col-left">
        <div class="header-button header-tab-status">
          <div class="header-button-text">
            <span>
              {{user.username}} - (S: {{sessionUser.name}})
            </span>
          </div>
        </div>
        <div class="header-tab-list-data" v-if="$route.path == '/home'">
          <div class="header-button header-tab-data"
            v-for="(order, index) in ordersHeader"
            :key="order.ref"
            :class="[(order.isActive ? 'is-actived' : ''), (order.isOrderTogo ? 'is-order-togo' : 0)]"
            @click="selectOrder(order.ref)">
            <div class="header-button-text">
              <span>
                Order {{index + 1}}({{order.totalPrice}})
              </span>
            </div>
          </div>
        </div>
        <div class="header-tab-add-more" @click="newOrder()" v-if="$route.path == '/home'">
          <div class="add-more-btn">
            <span class="icon-add-outline"></span>
          </div>
        </div>
      </div>
      <div class="header-col header-col-right">
        <div class="header-button header-button-search"
          :class="{'is-active' : isShowSearch}"
          v-if="$route.path == '/home'"
          @click="doClickSearch()"
        >
          <span class="icon-search"></span>
        </div>
      </div>
      <div class="search-input" v-if="isShowSearch">
        <input type="text" class="search-input-data" id="search-header" @input="onInputChange" v-focus>
      </div>
      <div class="page-title" v-if="$route.path == '/list-ordered'">
        <span v-if="this.queryUrl == 'reload'">Reload Order List</span>
        <span v-if="this.queryUrl == 'verkaufs'">Verkauflist</span>
        <span v-if="this.queryUrl == 'retour'">Retour Order List</span>
      </div>
    </div>

    <div class="header-smallscreen" v-if="isOnSmallScreen">
      <div class="wrapper">
        <div class="header-btn exit-btn">
          <span>EXIT</span>
        </div>
        <div class="header-btn">
          <span>{{order.fullName}}</span>
          <span class="change-user">Change User</span>
        </div>
        <div class="header-btn">
          <span>Table: {{order.tableName}}</span>
          <span class="table-total-price">{{order.totalPrice}}€</span>
        </div>
        <div class="header-btn">
          <span>EXTRA</span>
        </div>
      </div>
    </div>

    <KeyboardHeader 
    @onChange="onChange" 
    :inputSelected="inputSelected" 
    :inputNameSelected="inputNameSelected" 
    :inputValueSelected="inputValueSelected" 
    :input="input" ref="keyboard"/>
  </header>
</template>
<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import KeyboardHeader from '@/components/elements/keyboard/KeyboardHeader.vue'
  import UserDataService from '@/mixins/UserDataService'
  import SessionUserFetchingService from '@/mixins/SessionUserFetchingService'

  export default {
    mixins: [
      UserDataService,
      SessionUserFetchingService
    ],

    components: {
      'KeyboardHeader': KeyboardHeader
    },

    data() {
      return {
        userSessionData: {},
        queryUrl: '',

        // biến bàn phím ảo
        input: '',
        inputNameSelected: '',
        inputValueSelected: '',
        inputSelected: '',
      };
    },

    directives: {
      focus: {
        inserted(el) {
          el.focus();
        }
      }
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        isShowSearch: state => state.helper.isShowSearch,
        allProductLazyLoad: state => state.product.allProductLazyLoad,
        tableOrdered: state => state.table.tableOrdered,
        orderSelected: state => state.order.orderSelected,
        allTablesData: state => state.table.allTablesData,
        users: state => state.user.users,
        user: state => state.user.user,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        sessionUser: state => state.sessionUser.sessionUser,
      }),

      ordersHeader() {
        let ordersFilter = this.orders.filter(order => order.tableCode == this.tableOrdered.code);

        return ordersFilter;
      },

      order() {
        let userFilter = this.users.filter(user => user.username == this.orderSelected.userCode);
        let tableFilter = this.allTablesData.filter(table => table.code == this.orderSelected.tableCode);
        
        return {
          fullName: globalFunction.checkValid(userFilter[0]) ? userFilter[0].fullname : '',
          tableName: globalFunction.checkValid(tableFilter[0]) ? tableFilter[0].name : '',
          totalPrice: this.orderSelected.totalPrice
        }
      }
    },

    methods: {
      newOrder() {
        this.$store.dispatch('order/addNewOrder');
        this.$store.commit('numboardHome/setMengeState', false);
      },

      selectOrder(ref) {
        this.$store.dispatch('order/selectOrder', [ref]);
        this.$store.commit('numboardHome/setMengeState', false);
      },

      doClickSearch() {
        this.$store.dispatch('helper/updateSearchState');
        this.showHideSearchKeyboard(this.isShowSearch);
        this.input = '';

        this.$store.dispatch('product/searchProduct', [this.input]);
      },

      // method bàn phím ảo
      showHideSearchKeyboard(value) {
        this.$store.dispatch('helper/updateKeyboardState', value);
        this.$store.dispatch('helper/showHideSearchKeyboard', value);

        this.inputSelected = '#search-header';
        this.inputNameSelected = 'search-header';

        setTimeout(() => {
          this.$refs.keyboard.setInputName();
          this.$refs.keyboard.handleHeightCloseButton();
        }, 0);
      },

      onChange(input) {
        this.input = input;
        document.querySelector(this.inputSelected).value = input;
        this.doSearchProduct();
      },

      onInputChange(e) { // tracking các input change được tạo ra không phải từ bàn phím ảo
        this.input = e.target.value;
        this.inputValueSelected = e.target.value;
        this.doSearchProduct();

        setTimeout(() => {
          this.$refs.keyboard.setInputValue();
        }, 0);
      },

      doSearchProduct() {
        this.$store.dispatch('product/searchProduct', [this.input]);
      },

      detectQueryUrl() {
        this.queryUrl = this.$route.query.type;
      },
    },

    created() {
      this.detectQueryUrl();
    }
  };
</script>