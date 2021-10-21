<template>
  <div class="popup-wrapper">
    <div class="popup-type type-move-dish" v-if="isActiveMoveDishPopup">
      <div class="popup-heading">
        <h2>Move Dish</h2>
      </div>
      <div class="popup-error">
        <h3 v-if="isNoOrderSelectedToMove">Please select order to move dish</h3>
        <h3 v-if="isTableTargetEmpty">Please select table to move dish</h3>
        <h3 v-if="isTabOfTableTargetEmpty">Please select tab of table to move dish</h3>
      </div>
      <div class="popup-main">
        <div class="main-block">
          <div class="move-dish-box old-box" :class="{'disable-action' : tableSelectedToMove == ''}">
            <div class="box-heading">
              <div class="row-select">
                <div class="row-select-text">
                  Bàn gốc: 
                </div>
                <div class="table-selected">
                  {{tableOrdered.name}}
                </div>
              </div>
              <div class="select-all-dish">
                <div class="select-all-text">
                  Select all:
                </div>
                <label class="check-input">
                  <input type="checkbox" v-model="selectAllDish" @change="handleSelectAll()">
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
            <div class="list-header">
              <ul class="row-list">
                <li class="row-item plu-col">Nr</li>
                <li class="row-item article-col">Article</li>
                <li class="row-item">Amount</li>
                <li class="row-item">Price</li>
                <li class="row-item">Total</li>
              </ul>
            </div>
            <div class="list-body">
              <div class="list-body-wrapper">
                <ul class="row-list"
                  v-for="(order, index) in orderOrigin.orderLines"
                  :key="index"
                  @click="selectOrderToMove(order)"
                  :class="{'is-selected': order.isSelectedToMoveDish}">
                  <li class="row-item plu-col">
                    {{order.plu}}
                  </li>
                  <li class="row-item article-col">
                    {{order.name}}
                  </li>
                  <li class="row-item">
                    {{order.quantity}}
                  </li>
                  <li class="row-item">
                    {{order.price}}€
                  </li>
                  <li class="row-item">
                    {{order.totalAmount}}€
                  </li>
                </ul>
              </div>
            </div>
            <div class="row-sum">
              <span>Sum:</span>
              <span class="sum-number">
                {{orderOrigin.totalPrice}}€
              </span>
            </div>
          </div>
          <div class="arrow-selector">
            <div class="arrow-btn">
              <span class="icon-arrow-thick-right"></span>
            </div>
            <div class="arrow-btn">
              <span class="icon-arrow-thick-left"></span>
            </div>
          </div>
          <div class="move-dish-box new-box">
            <div class="box-heading">
              <div class="row-select list-tables">
                <div class="row-select-text">
                  Bàn mới: 
                </div>
                <select v-model="tableSelectedToMove" @change="changeTableTarget($event)">
                  <option v-for="(table, index) in tablesToMove" :value="table.code" :key="index">
                    {{table.name}}
                  </option>
                </select>
              </div>
              <div class="row-select table-tabs" v-if="tableTabsTarget > 1">
                <div class="row-select-text">
                  Tab:
                </div>
                <div class="select-all-checkbox">
                  <select v-model="tableTabTargetSelectedToMove" @change="changeTableTabTarget($event)">
                    <option v-for="(tab, index) in arrTableTabsTarget" :value="tab.ref" :key="index">
                      {{index + 1}}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="list-header">
              <ul class="row-list">
                <li class="row-item plu-col">Nr</li>
                <li class="row-item article-col">Article</li>
                <li class="row-item">Amount</li>
                <li class="row-item">Price</li>
                <li class="row-item">Total</li>
              </ul>
            </div>
            <div class="list-body">
              <div class="list-body-wrapper">
                <ul class="row-list"
                  v-for="(order, index) in orderTarget.orderLines"
                  :key="index">
                  <li class="row-item plu-col">
                    {{order.plu}}
                  </li>
                  <li class="row-item article-col">
                    {{order.name}}
                  </li>
                  <li class="row-item">
                    {{order.quantity}}
                  </li>
                  <li class="row-item">
                    {{order.price}}€
                  </li>
                  <li class="row-item">
                    {{order.totalAmount}}€
                  </li>
                </ul>
              </div>
            </div>
            <div class="row-sum">
              <span>Sum:</span>
              <span class="sum-number">
                {{orderTarget.totalPrice}}€
              </span>
            </div>
          </div>
        </div>
        <div class="btn-confirm-wrap">
          <div class="btn-confirm yes-confirm is-alert" @click="confirmMoveDish()">Done</div>
          <div class="btn-confirm btn-type-1" @click="doMoveDish()">Move</div>
          <div class="btn-confirm no-confirm" @click="closePopup()">Cancel</div>
        </div>
      </div>
    </div>

    <div class="loading-box popup-loading" v-if="isLoadingPopupMoveDish">
      <div class="loading-box-wrap">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="btn-wrap">
        <div class="btn-box" @click="cancelReceiveDish()">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import eventBus from '@/eventBus/eventBus.js'
  import TableService from '@/services/TableService'
  import OrderService from '@/services/OrderService'

  export default {
    data() {
      return {
        tableSelectedToMove: '',
        selectAllDish: false,
        ordersSelectedToMove: [],
        isTableTargetEmpty: false,
        isNoOrderSelectedToMove: false,
        userTableSelected: '',
        tableTabsTarget: 0,
        arrTableTabsTarget: [],
        tableTabTargetSelectedToMove: '',
        isTabOfTableTargetEmpty: false,
        isReadyToMoveDish: false
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        isActiveMoveDishPopup: state => state.order.isActiveMoveDishPopup,
        allTablesData: state => state.table.allTablesData,
        tableOrdered: state => state.table.tableOrdered,
        tablesToMove: state => state.tableFunction.tablesToMove,
        orderToMoveDish: state => state.order.orderToMoveDish,
        orderTargetMoveDish: state => state.order.orderTargetMoveDish,
        orderSelected: state => state.order.orderSelected,
        isLoadingPopupMoveDish: state => state.helper.isLoadingPopupMoveDish
      }),

      orderOrigin() {
        return {
          orderLines: this.orderToMoveDish.orderLines,
          totalPrice: Number(this.orderToMoveDish.totalPrice).toFixed(2),
        }
      },

      orderTarget() {
        return {
          orderLines: this.orderTargetMoveDish.orderLines,
          totalPrice: Number(this.orderTargetMoveDish.totalPrice).toFixed(2),
        }
      }
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
      },

      doMoveDish() {
        this.isTableTargetEmpty = false;
        this.isNoOrderSelectedToMove = false;
        this.isTabOfTableTargetEmpty = false;
        this.isReadyToMoveDish = false;

        for (var order of this.orderToMoveDish.orderLines) {
          if (order.isSelectedToMoveDish) {
            this.isNoOrderSelectedToMove = false;
            break;
          } else {
            this.isNoOrderSelectedToMove = true;
          }
        }

        if (this.isNoOrderSelectedToMove) {
          return;
        }

        if (this.tableSelectedToMove === '') {
          this.isTableTargetEmpty = true;
          return;
        }

        if (this.tableTabsTarget > 1 && this.tableTabTargetSelectedToMove == '') {
          this.isTabOfTableTargetEmpty = true;
          return;
        }

        this.$store.dispatch('order/doMoveDish');
        this.isReadyToMoveDish = true;
      },

      selectOrderToMove(paramOrder) {
        let isExistOrdersSelectedToMove = false;

        for (let order of this.ordersSelectedToMove) {
          if (order === paramOrder.codeToMove) {
            isExistOrdersSelectedToMove = true;
            break;
          }
        }

        if (!isExistOrdersSelectedToMove) {
          this.ordersSelectedToMove.push(paramOrder.codeToMove);
        } else {
          for (let i = 0; i < this.ordersSelectedToMove.length; i++) {
            if (this.ordersSelectedToMove[i] === paramOrder.codeToMove) {
              this.ordersSelectedToMove.splice(i, 1);
            }
          }
        }

        this.$store.dispatch('order/selectOrderToMoveDish', this.ordersSelectedToMove);
        this.$forceUpdate();
      },

      handleSelectAll() {
        this.ordersSelectedToMove = [];

        if (this.selectAllDish) {
          for (let order of this.orderOrigin.orderLines) {
            this.ordersSelectedToMove.push(order.codeToMove);
          }
        }

        this.$store.dispatch('order/selectOrderToMoveDish', this.ordersSelectedToMove);
      },

      resetStatePopupMoveDish() {
        eventBus.$on('resetDataMoveDish', $event => {
          this.tableSelectedToMove = '';
          this.selectAllDish = false;
          this.ordersSelectedToMove = [];
          this.isTableTargetEmpty = false,
          this.isNoOrderSelectedToMove = false;
          this.userTableSelected = '';
          this.tableTabsTarget = 0;
          this.arrTableTabsTarget = [];
          this.tableTabTargetSelectedToMove = '';
          this.isTabOfTableTargetEmpty = false;
          this.isReadyToMoveDish = false;
        });
      },

      changeTableTarget(event) {
        // console.log(this.tableSelectedToMove);
        this.$store.commit('helper/showLoading', true);
        this.isReadyToMoveDish = false;
        this.$store.commit('order/setOrderToMoveDish');
        this.ordersSelectedToMove = [];

        TableService.getAll().then(() => {
          // console.log('allTablesData:', this.allTablesData);
          for (let i = 0; i < this.allTablesData.length; i++) {
            if (this.tableSelectedToMove == this.allTablesData[i].code) {
              this.userTableSelected = this.allTablesData[i].username;
            }
          }
          // console.log('this.userTableSelected:', this.userTableSelected);

          OrderService.getOrdersByUser(this.userTableSelected).then((orders) => {
            // console.log('orders:', orders);

            this.tableTabsTarget = 0;
            this.tableTabTargetSelectedToMove = '';
            this.arrTableTabsTarget = [];
            this.$store.commit('order/setOrderTargetMoveDishEmptyOrderlines', this.orderSelected);
            for (let i = 0; i < orders.length; i++) {
              if (orders[i].userCode == this.userTableSelected && orders[i].tableCode == this.tableSelectedToMove) {
                this.arrTableTabsTarget.push(orders[i]);
              }
            }
            this.tableTabsTarget = this.arrTableTabsTarget.length;
            // console.log('this.arrTableTabsTarget:', this.arrTableTabsTarget);

            if (this.tableTabsTarget == 1) { // nếu bàn target chỉ có 1 tab
              this.$store.commit('order/setOrderTargetMoveDish', this.arrTableTabsTarget[0]);
            }

            this.$store.dispatch('order/calculateOrderTargetMoveDish');

            this.$store.commit('helper/showLoading', false);
          });
        });
      },

      changeTableTabTarget(event) {
        // console.log('this.tableTabTargetSelectedToMove:', this.tableTabTargetSelectedToMove);
        this.$store.commit('order/setOrderToMoveDish');
        this.ordersSelectedToMove = [];
        for (let i = 0; i < this.arrTableTabsTarget.length; i++) {
          if (this.arrTableTabsTarget[i].ref == this.tableTabTargetSelectedToMove) {
            this.$store.commit('order/setOrderTargetMoveDish', this.arrTableTabsTarget[i]);
          }
        }
      },

      confirmMoveDish() {
        if(this.isReadyToMoveDish) {
          let dataMoveDish = {};

          dataMoveDish.isNewTable = false;
          dataMoveDish.userCodeTarget = this.userTableSelected;
          if (dataMoveDish.userCodeTarget === '') {
            dataMoveDish.userCodeTarget = this.orderSelected.userCode;
            dataMoveDish.isNewTable = true;
          }
          dataMoveDish.userCodeOrigin = this.orderSelected.userCode;
          dataMoveDish.isDifferentUser = false;
          if (this.userTableSelected !== this.orderSelected.userCode) {
            dataMoveDish.isDifferentUser = true;
          }
          dataMoveDish.tableCode = this.tableSelectedToMove;
          dataMoveDish.dataOrder = this.orderTargetMoveDish;
          this.$socket.emit('CONFIRM_MOVE_DISH', dataMoveDish);

          this.isReadyToMoveDish = false;
        }
      },

      cancelReceiveDish() {
        this.$store.dispatch('popup/closePopup');
        this.$socket.emit('CANCEL_MOVE_DISH');
      }
    },

    created() {
      this.resetStatePopupMoveDish();
    },
  };
</script>

<style>

</style>
