<template>
  <div class="body-wrapper">
    <Header/>
    <div class="list-order-wrapper" :class="{'on-smallscreen': isOnSmallScreen}">
      <div class="customer-toolbar">
        <div class="search-box">
          <div class="search-icon-wrap">
            <span class="icon-search"></span>
          </div>
          <!-- <div class="input-customer-wrap" @click="showHideSearchCustomerKeyboard(true)"> -->
            <input type="text" 
            placeholder="Tìm kiếm" 
            class="input-search" 
            id="input-search-list-customer" 
            @input="onInputChange" @focus="showHideSearchListKeyboard($event, true)">
          <!-- </div> -->
          <div class="reset-btn">
            <span class="icon-close"></span>
          </div>
        </div>
        <div class="add-customer-btn-box" @click="addNewCustomer()">
          <span class="icon-user-add"></span>
        </div>
        <div class="routing-btn-box" @click="backToHome()">
          <span>Hủy</span>
          <span class="icon-cheveron-right"></span>
        </div>
      </div>
      <div class="product-list-box" ref="customerListBox">
        <div class="product-list-wrapper">
          <div class="row-header">
            <ul class="row-pl">
              <li class="col-pl small-type">
                <div class="col-pl-data">
                  Kunden Nr
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Tên
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Adresse
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Số bưu điện
                </div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  Tên công ty
                </div>
              </li>
            </ul>
          </div>
          <div class="row-body" ref="rowBody">
            <ul class="row-pl" v-for="(customer, index) in customers" :key="index" ref="rowData">
              <li class="col-pl small-type">
                <div class="col-pl-data">
                  {{customer.name}}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  {{customer.name}}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  {{customer.address}}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  {{customer.email}}
                </div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  {{customer.phone}}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="scroll-btn-box">
          <div class="scroll-btn scroll-up" @click="handleScrollList('up')">
            <span class="icon-arrow-thick-up"></span>
          </div>
          <div class="scroll-btn scroll-down" @click="handleScrollList('down')">
            <span class="icon-arrow-thick-down"></span>
          </div>
        </div>
      </div>
    </div>
    <KeyboardSearchList 
    @onChange="onChange" 
    :inputSelected="inputSelected" 
    :inputNameSelected="inputNameSelected" 
    :inputValueSelected="inputValueSelected" 
    :input="input" ref="keyboard"/>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue'
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import KeyboardSearchList from '@/components/elements/keyboard/KeyboardSearchList.vue'

  export default {

    data() {
      return {
        // biến bàn phím ảo
        input: '',
        inputNameSelected: '',
        inputValueSelected: '',
        inputSelected: '',
      }
    },

    computed: {
      ...mapState({
        customers: state => state.user.customers,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
      }),
    },

    components: {
      'Header': Header,
      'KeyboardSearchList': KeyboardSearchList,
    },

    methods: {
      async getAllCustomer() {
        this.$store.commit('helper/showLoading', true);
        let link = globalFunction.baseUrl + 'customer/selectall';
        let data = {};

        let allCustomer = await globalFunction.request(link, data);
        this.$store.commit('user/setCustomers', allCustomer);
        // console.log('allCustomer',allCustomer);
        this.$store.commit('helper/showLoading', false);
        
        setTimeout(() => {
          let hBlockFooter = 0;
          globalFunction.handleHeightListBox(this.$refs.customerListBox, this.$refs.rowBody, this.$refs.rowData, this.customers.length - 1, hBlockFooter, 'large');
        }, 0);
      },

      handleScrollList(direction) {
        let list = this.$refs.rowBody;
        let nextScroll = 200;

        this.currentItemScrollTo = list.scrollTop;

        switch (direction) {
          case 'down':
            this.currentItemScrollTo += nextScroll;
            list.scrollTop = this.currentItemScrollTo;
            if (list.scrollTop < this.currentItemScrollTo) {
              this.currentItemScrollTo = list.scrollTop;
            }
            break;
          case 'up':
            this.currentItemScrollTo -= nextScroll;
            list.scrollTop = this.currentItemScrollTo;
            break;
          default:
            break;
        }
      },

      backToHome() {
        this.$router.push({ path: 'home' });
      },

      addNewCustomer() {
        this.$router.push({ path: 'new-customer' });
      },

      // method bàn phím ảo
      showHideSearchListKeyboard(e, value) {
        if (!this.$device.android && !this.$device.ios) {
          this.$store.dispatch('helper/updateKeyboardState', value);
          this.$store.dispatch('helper/showHideSearchListKeyboard', value);

          this.inputSelected = `#${e.target.id}`;
          this.inputNameSelected = e.target.id;

          setTimeout(() => {
            this.$refs.keyboard.setInputName();
            this.$refs.keyboard.handleHeightCloseButton();
          }, 0);
        }
      },

      onChange(input) {
        this.input = input;
        document.querySelector(this.inputSelected).value = input;
      },

      onInputChange(e) { // tracking các input change được tạo ra không phải từ bàn phím ảo
        this.input = e.target.value;
        this.inputValueSelected = e.target.value;

        setTimeout(() => {
          this.$refs.keyboard.setInputValue();
        }, 0);
      },
    },

    created() {
      this.getAllCustomer();
      this.$store.dispatch('helper/hideAllKeyboard');
    }
  };
</script>