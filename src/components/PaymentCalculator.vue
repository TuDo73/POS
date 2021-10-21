<template>
  <div class="payment-calculator-wrap">
    <div class="payment-calculator" v-if="!isOnSmallScreen">
      <PaymentNumpad />
      <div class="payment-methods">
        <ul class="methods-list">
          <li class="methods-item">
            <div class="payment-btn confirm-btn" @click="goToPrint()">
              <div class="nav-btn-icon">
                <span class="icon-inbox-check"></span>
              </div>
              <span class="payment-btn-name">CONFIRM</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="methods-item">
            <div class="payment-btn back-btn" @click="backToHome()">
              <div class="nav-btn-icon">
                <span class="icon-reply"></span>
              </div>
              <span class="payment-btn-name">BACK</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="payment-method-smallscreen" v-if="isOnSmallScreen">
      <ul class="methods-list">
        <li class="methods-item">
          <div class="payment-btn confirm-btn" @click="goToPrint()">
            <div class="nav-btn-icon">
              <span class="icon-inbox-check"></span>
            </div>
            <span class="payment-btn-name">CONFIRM</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="methods-item">
          <div class="payment-btn back-btn" @click="backToHome()">
            <div class="nav-btn-icon">
              <span class="icon-reply"></span>
            </div>
            <span class="payment-btn-name">BACK</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
      </ul>
    </div>
  </div> 
</template>
<script>
  import PaymentNumpad from '@/components/PaymentNumpad.vue'
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import OrderService from '@/services/OrderService.js'

  export default {
    data() {
      return {}
    },
    
    computed: {
      ...mapState({
        orderSelected: state => state.order.orderSelected,
        orders: state => state.order.orders,
        isOnSmallScreen: state => state.helper.isOnSmallScreen
      }),
    },

    components: {
      'PaymentNumpad': PaymentNumpad
    },

    methods: {
      backToHome() {
        this.$router.push({ path: 'home' });
      },

      async goToPrint() {
        let orderSelectedTmp = {...this.orderSelected};
        let currentTime = new Date().getTime();
        let ordersTmp = [...this.orders];
        let isOrderTogo = orderSelectedTmp.isOrderTogo;

        orderSelectedTmp.endTime = currentTime;

        if (Number(orderSelectedTmp.moneyChange) < 0) { // không cho phép tiền trả nhỏ hơn tổng tiền hóa đơn
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('payment/showHidePopupCheckValidPayment', true);
          return;
        }
        
        if(orderSelectedTmp.orderExcluded.length > 0) { // Xử lý nếu tách hóa đơn
          let newOrder = {};

          orderSelectedTmp.orderLines = [];
          orderSelectedTmp.orderLines = [...orderSelectedTmp.orderIncluded];

          newOrder = {...orderSelectedTmp};
          newOrder.ref = orderSelectedTmp.userCode + currentTime;
          newOrder.orderLines = [...orderSelectedTmp.orderExcluded];

          for(let order of ordersTmp) {
            if(order.ref == orderSelectedTmp.ref) {
              order.endTime = orderSelectedTmp.endTime;
              order.orderLines = [...orderSelectedTmp.orderLines];
              order.orderIncluded = [...orderSelectedTmp.orderIncluded];
              order.orderExcluded = [...orderSelectedTmp.orderExcluded];
            }
          }
          ordersTmp.unshift(newOrder);
        } else { // Nếu không tách hóa đơn
          for(let order of ordersTmp) {
            if(order.ref == orderSelectedTmp.ref) {
              order.endTime = orderSelectedTmp.endTime;
            }
          }
        }
        
        // update array orders để lưu lên API
        for(let order of ordersTmp) {
          if(order.ref == orderSelectedTmp.ref) {
            order.moneyGiven = orderSelectedTmp.moneyGiven;
            order.moneyChange = orderSelectedTmp.moneyChange;
            order.orderDiscountValue = orderSelectedTmp.orderDiscountValue;
          }
        }

        this.$store.commit('order/setOrderSelected', orderSelectedTmp);
        this.$store.commit('order/setOrders', ordersTmp);
        
        this.$store.commit('helper/showLoading', true);
        
        // console.log('orderSelectedTmp:', orderSelectedTmp);
        OrderService.addOrder(orderSelectedTmp).then(orderResp => {
          this.$store.commit('order/setBelegOrder', orderResp.beleg);

          OrderService.save().then(() => {
            this.$store.commit('helper/showLoading', false);
            this.$router.push({ path: '/print' });
          });
        });
      }
    },

    created() {}
  };
</script>