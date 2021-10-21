<template>
  <div class="to-go-box">
    <div class="wrapper">
      <ul class="to-go-list">
        <li class="list-item"
          v-for="order in ordersTmp"
          :key="order.ref"
          @click="doSelectTable(order.tableUser, order.ref)">
            <span>
              User: {{order.userCode}}
            </span>
            <span>
              {{order.startTimeCounter}}
            </span>
            <span>
              {{order.totalPrice}}€
            </span>
        </li>
        <li class="list-item new-order-to-go" @click="newOrderTogo()">
          <span>New Order</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import UserDataService from '@/mixins/UserDataService'
  import OrdersDataService from '@/mixins/OrdersDataService'
  import OrderService from '@/services/OrderService.js'
  
  export default {
    mixins: [
      UserDataService,
      OrdersDataService
    ],

    data() {
      return {
        interval: null,
        currentTime: '',
        ordersTmp: []
      };
    },

    computed: {
      ...mapState({
        allTablesData: state => state.table.allTablesData,
        user: state => state.user.user,
        users: state => state.user.users,
        orders: state => state.order.orders,
        isGetOrdersFinished: state => state.helper.isGetOrdersFinished
      }),
    },

    watch: {
      isGetOrdersFinished() {
        if(this.isGetOrdersFinished) {
          this.ordersTmp = [];
          for(let order of this.orders) {
            if(order.isOrderTogo) {
              for(let table of this.allTablesData) {
                if(table.code == order.tableCode) {
                  order.tableUser = {...table};
                  order.startTimeCounter = '00:00';
                }
              }
              this.ordersTmp.push(order);
            }
          }
        }
      }
    },

    methods: {
      newOrderTogo() {
        let tableTogo = {};

        for(let table of this.allTablesData) {
          if(table.isTogo) {
            tableTogo = table;
          }
        }
        this.$store.dispatch('table/selectTable', [tableTogo, this.user.username, this.user.fullname]);
      },

      async doSelectTable(table, refOrder) {
        this.$store.commit('helper/showLoading', true);
        OrderService.setRefOrder(refOrder, this.user.username).then(() => {
          this.$store.commit('table/setValueRefOrderTogoSelected', refOrder);
          this.$store.dispatch('table/selectTable', [table, this.user.username, this.user.fullname]);
          this.$store.commit('helper/showLoading', false);
        });
      },

      updateCurrentTime: function() {
        for(let order of this.ordersTmp) {
          let now = new Date().getTime();
          let distance = now - order.startTime;

          let strTimeCounter = globalFunction.timeCounter(distance);
          
          order.startTimeCounter = strTimeCounter;
        }
        this.$forceUpdate();
      }
    },

    created() {
      this.interval = setInterval(this.updateCurrentTime, 1000);
    },

    destroyed() {
      clearInterval(this.interval);
    },
  };
</script>
