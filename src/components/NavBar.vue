<template>
  <div class="nav-bar">
    <ul class="nav-list" v-if="!isOnSmallScreen">
      <li class="nav-item">
        <div class="nav-btn order-btn" @click="doOrderConfirm()">
          <div class="nav-btn-icon">
            <span class="icon-inbox-check"></span>
          </div>
          <span class="nav-btn-text">ORDER CONFIRM</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item">
        <div class="nav-btn pay-cash-btn" @click="payCash()">
          <div class="nav-btn-icon">
            <span class="icon-money"></span>
          </div>
          <span class="nav-btn-text">PAY</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item">
        <div class="nav-btn review-btn" @click="goToPaymentReview()">
          <div class="nav-btn-icon">
            <span class="icon-paste"></span>
          </div>
          <span class="nav-btn-text">Review</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item" @click="backToTable()">
        <div class="nav-btn back-btn">
          <div class="nav-btn-icon">
            <span class="icon-reply"></span>
          </div>
          <span class="nav-btn-text">BACK</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
    </ul>

    <ul class="nav-bar-smallscreen" v-if="isOnSmallScreen">
      <li class="nav-item" @click="backToTable()">
        <div class="nav-btn back-btn">
          <div class="nav-btn-icon">
            <span class="icon-reply"></span>
          </div>
          <span class="nav-btn-text">BACK</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item">
        <div class="nav-btn pay-cash-btn" @click="payCash()">
          <div class="nav-btn-icon">
            <span class="icon-money"></span>
          </div>
          <span class="nav-btn-text">PAY</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item">
        <div class="nav-btn review-btn" @click="goToPaymentReview()">
          <div class="nav-btn-icon">
            <span class="icon-paste"></span>
          </div>
          <span class="nav-btn-text">Review</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
      <li class="nav-item">
        <div class="nav-btn order-btn" @click="doOrderConfirm()">
          <div class="nav-btn-icon">
            <span class="icon-inbox-check"></span>
          </div>
          <span class="nav-btn-text">ORDER CONFIRM</span>
          <div class="overlay-btn"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import OrderService from '@/services/OrderService.js'
  import TableService from '@/services/TableService'
  
  export default {
    data() {
      return {};
    },

    computed: {
      ...mapState({
        isMenge: state => state.numboardHome.isMenge,
        orderSelected: state => state.order.orderSelected,
        orders: state => state.order.orders,
        allTablesData: state => state.table.allTablesData,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        users: state => state.user.users,
        user: state => state.user.user,
        orderToCompare: state => state.compareOrder.orderToCompare,
        isDiff: state => state.compareOrder.isDiff
      })
    },

    methods: {
      openMenu() {
        let functionBox = document.querySelector('.function-box');
        let categoryBox = document.querySelector('.category-box');

        functionBox.classList.toggle('open');
        categoryBox.classList.toggle('open');
      },

      async doOrderConfirm() {
        if(this.orderSelected.orderLines.length) {
          this.$store.dispatch('compareOrder/diffOrders', this.orderSelected);
          if (this.isDiff) {
            return;
          }

          // chỉ thực hiện order confirm nếu order list có thay đổi
          this.$store.dispatch('order/doConfirmOrder');
          this.$store.commit('numboardHome/setMengeState', false);
          if(!this.orderSelected.isOrderTogo) { // trường hợp ko phải hóa đơn to-go
            let togo = this.orderSelected.orderLines.some(orderLine => orderLine.isTogo);
          
            if(togo) { // tách hóa đơn nếu có món to-go trong order list
              this.$store.dispatch('order/splitOrder', 'togo');
            }
          }

          // xử lý dữ liệu socket giá tiền order của bàn hiện tại
          let tableOrders = this.orders.filter((order) => order.tableCode == this.orderSelected.tableCode);

          let tableTotalPrice = tableOrders.map((order) => order.totalPrice).reduce((sum, item) => sum += Number(item), 0) || 0;

          let tableData = {};
          tableData.tableCode = this.orderSelected.tableCode;
          tableData.userName = this.orderSelected.userCode;
          tableData.userFullName = this.users.filter(user => user.username == this.orderSelected.userCode).reduce((users, user) => {return user.fullname}, []);
          tableData.totalPrice = tableTotalPrice;
          this.$socket.emit('SELECT_TABLE', tableData);

          let currentTable = this.allTablesData.filter(table => table.code == this.orderSelected.tableCode)[0];
          currentTable.totalprice = tableTotalPrice;

          let urlTable = globalFunction.baseUrl + 'table/add';
          this.$store.commit('helper/showLoading', true);
          let tableResponse = await globalFunction.request(urlTable, currentTable);

          if(currentTable.isTogo) { // nếu là order to go thì sẽ lưu order ref lại và lưu toàn bộ orders lên server
            this.$store.commit('table/setValueRefOrderTogoSelected', this.orderSelected.ref);
            OrderService.setRefOrder(this.orderSelected.ref, this.user.username).then(() => {
              // lưu order lên server
              OrderService.save().then(() => {
                this.$store.commit('helper/showLoading', false);
              });
            });
          } else { // nếu không phải là order to go thì chỉ lưu toàn bộ orders lên server, không dùng tới order ref
            OrderService.save().then(() => {
              this.$store.commit('helper/showLoading', false);
            });
          }
        }
      },

      backToTable() {
        if(!this.allTablesData.length) {
          this.$store.commit('helper/showLoading', true);

          TableService.getAll().then(() => {
            this.$store.commit('helper/showLoading', false);

            this.doActionBackToTable();
          });
        } else {
          this.doActionBackToTable();
        }
      },

      async doActionBackToTable() {
        let currentTable = this.orderSelected.tableCode;
        let ableExitTable = true;

        for(let order of this.orders) {
          if(order.tableCode == currentTable) {
            if(order.orderLines.length > 0) {
              ableExitTable = false;
            }
          }
        }

        if(ableExitTable) {
          this.$store.commit('helper/showLoading', true);

          let tableTmp = this.allTablesData.filter((table) => {
            if (table.code == currentTable) {
              return table;
            }
          });
          tableTmp = tableTmp[0];

          tableTmp.totalprice = 0;
          tableTmp.username = '';
          tableTmp.userFullName = '';
          tableTmp.isbusy = false;

          let link = globalFunction.baseUrl + 'table/add';
          let tableResponse = await globalFunction.request(link, tableTmp);
          if(tableResponse.successful) {
            this.$socket.emit('QUIT_TABLE', tableTmp);
            this.$store.dispatch('order/removeOrder', this.orderSelected);

            this.$store.commit('helper/showLoading', false);
          }
        }
        
        this.$router.push({ path: 'table' });
      },

      goToPaymentReview() {
        if(!this.orderSelected.orderLines.length) {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('popup/updatePopupNoProductForPay', true);
          return;
        }

        for(let orderLine of this.orderSelected.orderLines) {
          if(!orderLine.isOrderConfirmed) {
            this.$store.dispatch('popup/updatePopupState', true);
            this.$store.dispatch('popup/updatePopupNeedConfirmProduct', true);
            return;
          }
        }
        
        this.$router.push({ path: 'payment-review' });
      },

      payCash() {
        if(!this.orderSelected.orderLines.length) {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('popup/updatePopupNoProductForPay', true);
          return;
        }

        for(let orderLine of this.orderSelected.orderLines) {
          if(!orderLine.isOrderConfirmed) {
            this.$store.dispatch('popup/updatePopupState', true);
            this.$store.dispatch('popup/updatePopupNeedConfirmProduct', true);
            return;
          }
        }

        // lưu order lên server
        this.$store.commit('helper/showLoading', true);
        OrderService.save().then(() => {
          this.$store.commit('helper/showLoading', false);
          this.$router.push({ path: 'payment' });
        });
      },
    }
  };
</script>

<style>

</style>
