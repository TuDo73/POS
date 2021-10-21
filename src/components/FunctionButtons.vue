<template>
  <div class="function-buttons">
    <div class="control-bar">
      <ul class="control-list" v-if="currentPage === 1">
        <li class="control-item">
          <div class="control-btn" @click="doNextFunctionPage()">
            <span class="icon-fast-forward"></span>
            <span class="control-btn-title">Page {{ nextPage }}</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item table-function">
          <div class="control-btn" @click="openTableFunction()" :class="{'is-active': isTableFunction}">
            <span class="icon-browser-window"></span>
            <span class="control-btn-title">Table Function</span>
            <div class="overlay-btn"></div>
          </div>
          <div class="table-function-list" v-if="isTableFunction">
            <!-- <div class="table-function-item">
              <span>Move Table</span>
              <div class="overlay-btn"></div>
            </div> -->
            <div class="table-function-item" @click="showMoveDishPopup()">
              <span>Move Dish</span>
              <div class="overlay-btn"></div>
            </div>
            <div class="table-function-item" @click="showChangeUserPopup()">
              <span>Change User</span>
              <div class="overlay-btn"></div>
            </div>
            <div class="close-table-function-smallscreen" v-if="isOnSmallScreen" @click="openTableFunction()"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="doStorno()">
            <span class="icon-block"></span>
            <span class="control-btn-title">Storno</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="showHidePopupExtra()">
            <span class="icon-add-outline"></span>
            <span class="control-btn-title">Extra</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="showHidePopupDiscount()">
            <span class="icon-swap"></span>
            <span class="control-btn-title">Discount</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="doNextDish()">
            <span class="icon-location-food"></span>
            <span class="control-btn-title">Next Dish</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="doStornoAll()">
            <span class="icon-buoy"></span>
            <span class="control-btn-title">Storno all</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" :class="{'is-active': isMenge}" @click="doMenge()">
            <span class="icon-calculator"></span>
            <span class="control-btn-title">Menge</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
      </ul>

      <ul class="control-list" v-if="currentPage === 2">
        <li class="control-item">
          <div class="control-btn prev-page-btn" @click="doPrevFunctionPage()">
            <span class="icon-fast-rewind"></span>
            <span class="control-btn-title">Page {{ prevPage }}</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <!-- <li class="control-item">
          <div class="control-btn prev-page-btn" @click="doNextFunctionPage()">
            <span class="icon-fast-forward"></span>
            <span class="control-btn-title">Page {{ nextPage }}</span>
            <div class="overlay-btn"></div>
          </div>
        </li> -->
        <li class="control-item">
          <div class="control-btn" @click="goToListCustomer()">
            <span class="icon-user-solid-square"></span>
            <span class="control-btn-title">Customer</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="showHidePopupChangePrice()">
            <span class="icon-duplicate"></span>
            <span class="control-btn-title">New Price</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn">
            <span class="icon-watch"></span>
            <span class="control-btn-title">Delivery</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn" @click="showHidePopupTogo()">
            <span class="icon-travel-walk"></span>
            <span class="control-btn-title">To-Go (7%)</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <!-- <li class="control-item">
          <div class="control-btn">
            <span class="icon-station"></span>
            <span class="control-btn-title">Return</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn">
            <span class="icon-show-sidebar"></span>
            <span class="control-btn-title">Selling List</span>
            <div class="overlay-btn"></div>
          </div>
        </li> -->
        <li class="control-item">
          <div class="control-btn" @click="goToListOrdered()">
            <span class="icon-repost"></span>
            <span class="control-btn-title">Repeat</span>
            <div class="overlay-btn"></div>
          </div>
        </li>  
      </ul>

      <!-- <ul class="control-list" v-if="currentPage === 3">
        <li class="control-item">
          <div class="control-btn prev-page-btn" @click="doPrevFunctionPage()">
            <span class="icon-fast-rewind"></span>
            <span class="control-btn-title">Page {{ prevPage }}</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
        <li class="control-item">
          <div class="control-btn">
            <span class="icon-shield"></span>
            <span class="control-btn-title">Coupon</span>
            <div class="overlay-btn"></div>
          </div>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'
  import eventBus from '@/eventBus/eventBus.js'
  import TableService from '@/services/TableService.js'
  import UserService from '@/services/UserService.js'

  export default {
    data() {
      return {
        currentPage: 1,
        nextPage: 2,
        prevPage: 1
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        isMenge: state => state.numboardHome.isMenge,
        isTableFunction: state => state.numboardHome.isTableFunction,
        orderSelected: state => state.order.orderSelected,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        allTablesData: state => state.table.allTablesData,
        tableOrdered: state => state.table.tableOrdered,
        user: state => state.user.user
      })
    },

    methods: {
      checkActionValid() {
        if (this.orderSelected.orderLines.length) {
          let validToGo = false;

          for (let i = 0; i < this.orderSelected.orderLines.length; i++) {
            if (this.orderSelected.orderLines[i].isDisableSelect == false) {
              validToGo = true;
              break;
            }
          }
          if (validToGo) {
            return true;
          }
        }

        return false;
      },

      checkOrderNoConfirmed(isShowPopupNotice = true) {
        if(this.orderSelected.orderLines.length) {
          let validToGo = true;
          for(let i = 0; i < this.orderSelected.orderLines.length; i++) {
            if(this.orderSelected.orderLines[i].isHighlight && this.orderSelected.orderLines[i].isOrderConfirmed) {
              if(isShowPopupNotice) {
                this.$store.dispatch('popup/updatePopupState', true);
                this.$store.dispatch('popup/updatePopupNoticeOrderConfirm', true);
              }
              validToGo = false;
              break;
            }
          }
          if(validToGo) {
            return true;
          }
        }

        return false;
      },

      checkIsSelectedOrderLine() {
        if(this.orderSelected.orderLines.length) {
          let validToGo = false;

          for (let i = 0; i < this.orderSelected.orderLines.length; i++) {
            if (this.orderSelected.orderLines[i].isHighlight == true) {
              validToGo = true;
              break;
            }
          }
          if (validToGo) {
            return true;
          }
        }

        return false;
      },

      openTableFunction() {
        if (this.checkActionValid()) {
          for(let orderLine of this.orderSelected.orderLines) {
            if(!orderLine.isOrderConfirmed) {
              this.$store.dispatch('popup/updatePopupState', true);
              this.$store.dispatch('popup/updatePopupNeedConfirmProduct', true);
              return;
            }
          }

          this.$store.commit('numboardHome/setMengeState', false);

          let tmpState = this.isTableFunction;
          tmpState = !tmpState;
          this.$store.commit('numboardHome/setTableFunctionState', tmpState);
        }
      },

      doNextFunctionPage() {
        if(this.currentPage < 4) {
          this.currentPage += 1;
          this.nextPage = this.currentPage + 1;
          this.prevPage = this.currentPage - 1;
        }
      },

      doPrevFunctionPage() {
        if(this.currentPage > 0) {
          this.currentPage -= 1;
          this.nextPage = this.currentPage + 1;
          this.prevPage = this.currentPage - 1;
        }
      },

      doStorno() {
        this.$store.commit('helper/setStornoAll', false);

        if (this.checkIsSelectedOrderLine()) {
          if(this.checkActionValid() && this.checkOrderNoConfirmed(false)) {
            this.$store.dispatch('order/doStorno');
          } else {
            this.$store.dispatch('popup/updatePopupState', true);
            this.$store.dispatch('popup/updatePopupPasswordAdmin', true);
          }
  
          this.$store.commit('numboardHome/setMengeState', false);
          this.$store.commit('numboardHome/setTableFunctionState', false);
        }
      },

      doStornoAll() {
        if(this.checkActionValid()) {
          let orderLines = this.orderSelected.orderLines;
          let isOrderConfirmExiting = false;

          this.$store.commit('helper/setStornoAll', true);
          isOrderConfirmExiting = orderLines.some(orderLine => orderLine.isOrderConfirmed && orderLine.isDisableSelect == false);

          if(isOrderConfirmExiting) { // order list tồn tại món đã confirm
            this.$store.dispatch('popup/updatePopupState', true);
            this.$store.dispatch('popup/updatePopupPasswordAdmin', true);
          } else { // order list chưa có món nào confirm
            this.$store.dispatch('order/doStornoAll', isOrderConfirmExiting);
          }
          this.$store.commit('numboardHome/setMengeState', false);
          this.$store.commit('numboardHome/setTableFunctionState', false);
        }
      },

      doMenge() {
        if(this.checkActionValid() && this.checkOrderNoConfirmed() && this.checkIsSelectedOrderLine()) {
          this.$store.commit('numboardHome/setTableFunctionState', false);

          let tmpState = this.isMenge;
  
          tmpState = !tmpState;
          this.$store.commit('numboardHome/setMengeState', tmpState);
          if(tmpState) {
            this.$store.commit('numboardHome/setValueMenge', '');
          }
        }
      },

      showHidePopupDiscount() {
        if(this.checkActionValid() && this.checkOrderNoConfirmed() && this.checkIsSelectedOrderLine()) {
          this.$store.commit('helper/setStateValidDiscountValue', true);
          this.$store.dispatch('popup/updatePopupState', true);
  
          for(let i = 0; i < this.orderSelected.orderLines.length; i++) {
            if(this.orderSelected.orderLines[i].isHighlight) {
              if(this.orderSelected.orderLines[i].isChangePrice && this.orderSelected.orderLines[i].priceOrigin !== this.orderSelected.orderLines[i].priceAfterChange) {// kiểm tra sản phẩm đã thay giá hay chưa
                this.$store.dispatch('popup/updatePopupAlertDiscount', true);
              } else {
                this.$store.dispatch('order/showHidePopupDiscount', true);
                this.$store.commit('numboardHome/setMengeState', false);
                this.$store.commit('numboardHome/setTableFunctionState', false);
                this.$store.commit('order/setValueDiscount', '');
                this.$store.commit('order/setDiscountType', false);
              }
            }
          }
        }
      },

      showHidePopupExtra() {
        if(this.checkActionValid() && this.checkOrderNoConfirmed() && this.checkIsSelectedOrderLine()) {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('order/showHidePopupExtra', true);
          this.$store.commit('numboardHome/setMengeState', false);
          this.$store.commit('numboardHome/setTableFunctionState', false);
        }
      },

      showHidePopupChangePrice() {
        if(this.checkActionValid() && this.checkOrderNoConfirmed() && this.checkIsSelectedOrderLine()) {
          this.$store.dispatch('popup/updatePopupState', true);

          for(let i = 0; i < this.orderSelected.orderLines.length; i++) {
            if(this.orderSelected.orderLines[i].isHighlight) {
              if(this.orderSelected.orderLines[i].isDiscount && this.orderSelected.orderLines[i].discount > 0) { // kiểm tra sản phẩm đã discount hay chưa
                this.$store.dispatch('popup/updatePopupAlertChangePrice', true);
              } else {
                this.$store.dispatch('order/showHidePopupChangePrice', true);
                this.$store.commit('numboardHome/setMengeState', false);
                this.$store.commit('numboardHome/setTableFunctionState', false);
                this.$store.commit('order/setValueNewPrice', '');
                this.$store.commit('order/setChangePriceType', true);
              }
            }
          }
        }
      },

      showHidePopupTogo() {
        if(this.checkActionValid() && this.checkOrderNoConfirmed() && this.checkIsSelectedOrderLine()) {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('order/showHidePopupTogo', true);
        }
      },

      doNextDish() {
        if(this.checkActionValid() && this.checkIsSelectedOrderLine()) {
          this.$store.dispatch('order/handleNextDish');
        }
      },

      showMoveDishPopup() {
        this.$store.commit('numboardHome/setTableFunctionState', false);
        this.$store.commit('helper/setStateLoadingPopupMoveDish', false);
        this.$store.commit('order/setOrderToMoveDish');
        this.$store.commit('order/setOrderTargetMoveDishEmptyOrderlines', this.orderSelected);
        this.$store.dispatch('order/calculateOrderTargetMoveDish');

        this.$store.dispatch('popup/updatePopupState', true);
        this.$store.dispatch('order/showHidePopupMoveDish', true);

        this.$store.dispatch('tableFunction/handleListTablesToMove', this.tableOrdered);

        eventBus.$emit('resetDataMoveDish', '');
      },

      showChangeUserPopup() {
        this.$store.commit('helper/showLoading', true);
        this.$store.commit('helper/setStateLoadingPopupChangeUser', false);

        // get all tables
        TableService.getAll().then(() => {
          // get all users
          UserService.getAll().then(() => {
            this.$store.commit('helper/showLoading', false);

            let userName = this.user.username
            this.$store.dispatch('tableFunction/handleTablesToChangeUser', userName);
            this.$store.dispatch('tableFunction/handleUsersReceiveTable', userName);

            eventBus.$emit('resetDataChangeUser', '');
            

            this.$store.commit('numboardHome/setTableFunctionState', false);
            this.$store.dispatch('popup/updatePopupState', true);
            this.$store.dispatch('order/showHidePopupChangeUser', true);
          });
        });
      },

      goToListOrdered() {
        if (!this.checkActionValid()) {
          this.$router.push({ path: 'list-ordered', query: { type: 'reload' } });
        } else {
          this.$store.dispatch('popup/updatePopupState', true);
          this.$store.dispatch('popup/updatePopupOrderNotEmpty', true);
        }
      },

      goToListCustomer() {
        this.$router.push({ path: 'list-customer' });
      }
    },

    created() {
      this.$store.commit('numboardHome/setMengeState', false);
      this.$store.commit('numboardHome/setTableFunctionState', false);
      this.$store.commit('numboardHome/setValueMenge', '');
    },
  };
</script>

<style>

</style>
