<template>
  <div class="body-wrapper">
    <div class="main-box" v-if="!isOnSmallScreen">
      <PaymentInfo/>
      <PaymentDetails/>
      <PaymentCalculator/>
    </div>

    <div class="payment-smallscreen" v-if="isOnSmallScreen">
      <div class="wrapper">
        <PaymentDetails/>
        <PaymentInfo/>
      </div>
      <PaymentCalculator/>
    </div>
  </div>
</template>
<script>
  import PaymentInfo from '@/components/PaymentInfo.vue'
  import PaymentDetails from '@/components/PaymentDetails.vue'
  import PaymentCalculator from '@/components/PaymentCalculator.vue'
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import UserDataService from '@/mixins/UserDataService'
  import OrdersDataService from '@/mixins/OrdersDataService'
  import TableService from '@/services/TableService'

  export default {
    mixins: [
      UserDataService,
      OrdersDataService
    ],

    components: {
      'PaymentInfo': PaymentInfo,
      'PaymentDetails': PaymentDetails,
      'PaymentCalculator': PaymentCalculator
    },

    data() {
      return {}
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected,
        allTablesData: state => state.table.allTablesData,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        isGetOrdersFinished: state => state.helper.isGetOrdersFinished
      })
    },

    watch: {
      isGetOrdersFinished() {
        if(this.isGetOrdersFinished) {
          for(let order of this.orders) {
            if(order.isActive) {
              this.$store.commit('order/setOrderSelected', order);
            }
          }

          this.$store.dispatch('payment/calculateOrderPayment', [this.orders, this.orderSelected]);
        }
      }
    },

    methods: {
      getData() {
        this.$store.commit('helper/showLoading', true);
        
        TableService.getAll().then(() => {
          this.$store.commit('helper/showLoading', false);
        });
      }
    },

    created() {
      this.getData();
      this.$store.commit('helper/setStateDiscountLocation', 'payment');
      this.$store.dispatch('helper/hideAllKeyboard');
    }
  };
</script>