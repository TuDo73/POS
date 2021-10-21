<template>
  <div class="body-wrapper" v-if="isComponentReady">
    <Header/>
    <main>
      <div class="print-details-box" :class="{'on-smallscreen': isOnSmallScreen}">
        <div class="bill-details-wrapper">
          <div class="bill-details-header" ref="billDetailsHeader">
            <div class="row-header">
              <div class="row-info">
                <div class="col-info">Name</div>
                <div class="col-info">Amount</div>
                <div class="col-info">Total</div>
                <div class="col-info">Discount</div>
              </div>
            </div>
            <div class="row-body" ref="rowBody">
              <div class="row-info"
                v-for="orderLine in orderInfo.orderLines"
                :key="orderLine.ref"
                :class="[(orderLine.isDisableSelect ? 'is-disable' : ''), (orderLine.isOverDiscount ? 'is-over-discount' : ''), (orderLine.isTogo ? 'is-togo' : '')]" ref="rowData">
                <div class="col-info">
                  {{orderLine.name}}
                </div>
                <div class="col-info">
                  {{orderLine.quantity}}
                </div>
                <div class="col-info">
                  {{orderLine.totalAmount}} €
                </div>
                <div class="col-info">
                  {{orderLine.discount}} €
                </div>
              </div>
            </div>
          </div>
          <div class="bill-details-body" ref="billDetailsBody">
            <div class="row-bill-details gesamt-box">
              <span class="gesamt-title">Gesamt: </span>
              <span class="gesamt-num">{{orderInfo.moneyToPay}} €</span>
            </div>
            <div class="row-bill-details total-discount-box">
              <span class="total-discount-title">Total Discount: </span>
              <span class="total-discount-num">{{orderInfo.totalDiscount}} €</span>
            </div>
          </div>
        </div>
      </div>
      <div class="print-box" :class="{'on-smallscreen': isOnSmallScreen}" ref="printBox">
        <div class="btn-print" @click="backToHome()">
          <span class="icon-print-box icon-reply"></span>
          <span class="text-box">BACK</span>
        </div>
        <div class="btn-print" @click="goToPayment()">
          <span class="icon-print-box icon-arrow-thick-right"></span>
          <span class="text-box">PAY</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import Header from '@/components/Header.vue'
  import UserDataService from '@/mixins/UserDataService'
  import OrdersDataService from '@/mixins/OrdersDataService'
  
  export default {
    mixins: [
      UserDataService,
      OrdersDataService
    ],

    components: {
      'Header': Header,
    },

    data() {
      return {
        isComponentReady: false
      };
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        isGetOrdersFinished: state => state.helper.isGetOrdersFinished
      }),

      orderInfo() {
        if(globalFunction.checkValid(this.orderSelected.orderLines)) {
          let orderLinesTmp = this.orderSelected.orderLines;
  
          for(let orderLine of orderLinesTmp) {
            orderLine.discount = Number(orderLine.discount).toFixed(2);
          }
          
          return {
            orderLines: orderLinesTmp,
            totalDiscount: (Number(this.orderSelected.totalPriceWithoutDiscount) - Number(this.orderSelected.moneyToPay)).toFixed(2),
            moneyToPay: Number(this.orderSelected.moneyToPay).toFixed(2)
          }
        }
      }
    },

    watch: {
      isGetOrdersFinished() {
        if(this.isGetOrdersFinished) {
          this.handleOrdersInfo();
        }
      }
    },

    methods: {
      handleOrdersInfo() {
        this.isComponentReady = false;
        for(let order of this.orders) {
          if(order.isActive) {
            this.$store.commit('order/setOrderSelected', order);
          }
        }
        this.isComponentReady = true;
        
        this.$store.dispatch('payment/calculateOrderPayment', [this.orders, this.orderSelected]);

        this.$store.dispatch('order/handleTaxOrder');

        this.$nextTick(() => {
          if(this.isComponentReady) {
            let hBlockFooter = this.$refs.billDetailsBody.getBoundingClientRect().height + this.$refs.printBox.getBoundingClientRect().height;
            globalFunction.handleHeightListBox(this.$refs.billDetailsHeader, this.$refs.rowBody, this.$refs.rowData, this.orderSelected.orderLines.length - 1, hBlockFooter, 'medium');
          }
        });
      },

      backToHome() {
        this.$router.push({ path: 'home' });
      },

      goToPayment() {
        this.$router.push({ path: 'payment' });
      }
    },

    created() {
      this.$store.dispatch('helper/hideAllKeyboard');
    }
  };
</script>

<style>

</style>
