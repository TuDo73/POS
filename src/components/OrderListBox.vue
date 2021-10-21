<template>
  <div class="order-list-box">
    <div class="order-list">
      <div class="order-list-header">
        <ul class="row-ol">
          <li class="ol-item plu-col">Nr</li>
          <li class="ol-item article-item">Article</li>
          <li class="ol-item quantity-item">Amount</li>
          <li class="ol-item price-item">Price</li>
          <li class="ol-item is-alert">Discount</li>
          <li class="ol-item">Total</li>
        </ul>
      </div>
      <div class="order-list-body">
        <div class="order-list-body-wrapper" v-if="isShowOrderLines">
          <ul class="row-ol"
            v-for="(order, index) in orderInfo.orderLines"
            :key="index"
            :class="[(order.isHighlight ? 'is-highlight' : ''), (order.isDisableSelect ? 'is-disable' : ''), (order.isOverDiscount ? 'is-over-discount' : ''), (order.isOrderConfirmed ? 'is-order-confirmed' : ''), (order.isTogo ? 'is-togo' : ''), (order.isNextDish ? 'is-next-dish' : '')]"
            @click="selectOrderLine(order, index)">
            <li class="ol-item plu-col">
              {{order.plu}}
            </li>
            <li class="ol-item article-item">
              {{order.name}}
              <div class="list-extras">
                <p v-for="extra in order.extras" :key="extra.code">
                  - {{extra}}
                </p>
              </div>
            </li>
            <li class="ol-item quantity-item">
              {{order.quantity}}
            </li>
            <li class="ol-item price-item">
              {{order.price}}€
            </li>
            <li class="ol-item is-alert">
              {{order.discount}}{{order.discountType}}
            </li>
            <li class="ol-item">
              {{order.totalAmount}}€
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="order-list-scroll">
      <div class="scroll-box-wrapper">
        <div class="scroll-btn scroll-up" @click="handleScrollOrderList('up')">
          <span class="icon-arrow-thick-up"></span>
        </div>
        <div class="scroll-btn scroll-down">
          <span class="icon-arrow-thick-down" @click="handleScrollOrderList('down')"></span>
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
        isShowOrderLines: false
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected,
      }),

      orderInfo() {
        if(globalFunction.checkValid(this.orderSelected.orderLines)) {
          let orderLinesTmp = this.orderSelected.orderLines;

          for(let order of orderLinesTmp) {
            if(order.discountType !== '%') {
              order.discount = Number(order.discount).toFixed(2);
              order.discountType = '€';
            }
            order.price = Number(order.price).toFixed(2);
          }

          return {
            orderLines: orderLinesTmp
          };
        }
      }
    },

    watch: {
      orderInfo() {
        if(globalFunction.checkValid(this.orderSelected.orderLines)) {
          this.isShowOrderLines = true;
        } else {
          this.isShowOrderLines = false;
        }
      }
    },

    methods: {
      selectOrderLine(orderLine, index) {
        this.$store.dispatch('order/setOrderLine', [orderLine, index]);
        this.$store.commit('numboardHome/setValueMenge', '');
        this.$store.commit('numboardHome/setMengeState', false);
      },

      handleScrollOrderList(direction) {
        this.$store.dispatch('order/handleScrollOrderList', [direction]);
        this.$store.commit('numboardHome/setMengeState', false);
      }
    },

    created() {
      this.$store.commit('order/setCurrentOrderLineSelected');
      this.$store.commit('order/setValueDiscount', '');
    },
  };
</script>

<style>

</style>
