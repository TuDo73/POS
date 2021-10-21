<template>
  <div class="payment-info-wrap">
    <div class="payment-info" v-if="!isOnSmallScreen">
      <div class="payment-info-top">
        <div class="row-info">
          <div class="col-btn customer-btn">
            <span>Customer</span>
          </div>
          <div class="col-btn table-btn">
            <span v-if="!tableOrdered.isTogo">
              Table {{orderForShow.tableName}}
            </span>
            <span v-else>
              To-go
            </span>
          </div>
        </div>
        <div class="before-discount">
          <span class="before-discount-title">Before Discount:</span>
          <span class="before-discount-num">{{orderForShow.totalPrice | centToEuroFormat}}</span>
        </div>
      </div>
      <div class="payment-info-bottom">
        <div class="products-payment-box included-box">
          <p>Included:</p>
          <ul class="products-payment-list" ref="includedList">
            <li class="list-item"
              v-for="product in orderForShow.orderIncluded"
              :key="product.ref"
              :class="[(product.isDisableSelect ? 'is-storno' : '')]"
              @click="handleClickOrderIncluded(product)">
              <span class="list-item-title">
                {{product.name}}
              </span>
              <span class="list-item-num">
                {{product.totalAmount}} €
              </span>
              <div class="change-products-payment">
                <div class="change-btn remove-btn"></div>
              </div>
            </li>
          </ul>
          <div class="products-payment-scroll-box">
            <div class="scroll-btn scroll-down" @click="handleScrollList('down', 'includedList')">
              <span class="icon-arrow-thick-down"></span>
            </div>
            <div class="scroll-btn scroll-up" @click="handleScrollList('up', 'includedList')">
              <span class="icon-arrow-thick-up"></span>
            </div>
          </div>
        </div>
        <div class="products-payment-box excluded-box">
          <p>Excluded:</p>
          <ul class="products-payment-list" ref="excludedList">
            <li class="list-item"
              v-for="product in orderForShow.orderExcluded"
              :key="product.ref"
              @click="handleClickOrderExcluded(product)">
              <span class="list-item-title">
                {{product.name}}
              </span>
              <span class="list-item-num">
                {{product.totalAmount}}€
              </span>
              <div class="change-products-payment">
                <div class="change-btn add-btn"></div>
              </div>
            </li>
          </ul>
          <div class="products-payment-scroll-box">
            <div class="scroll-btn scroll-down" @click="handleScrollList('down','excludedList')">
              <span class="icon-arrow-thick-down"></span>
            </div>
            <div class="scroll-btn scroll-up" @click="handleScrollList('up','excludedList')">
              <span class="icon-arrow-thick-up"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="payment-info-smallscreen" v-if="isOnSmallScreen">
      <div class="payment-details-heading">
        <div class="before-discount">
          <span class="before-discount-title">Total: </span>
          <span class="before-discount-num">{{orderForShow.totalPrice | centToEuroFormat}}</span>
        </div>
        <div class="discount-input" v-if="orderInfo.orderDiscountType === '€'">
          <span class="discount-title">Discount: </span>
          <span class="discount-num">{{orderInfo.orderDiscountValue | centToEuroFormat}}</span>
        </div>
        <div class="discount-input" v-if="orderInfo.orderDiscountType === '%'">
          <span class="discount-title">Discount: </span>
          <span class="discount-num">{{orderInfo.orderDiscountValue}}%</span>
        </div>
        <div class="total-payment">
          <div class="total-payment-title">To Pay:</div>
          <div class="total-payment-num">{{orderInfo.moneyToPay | centToEuroFormat}}</div>
        </div>
      </div>
      <div class="payment-info-bottom">
        <div class="products-payment-box included-box">
          <p>Included:</p>
          <ul class="products-payment-list" ref="includedList">
            <li class="list-item"
              v-for="product in orderForShow.orderIncluded"
              :key="product.ref"
              :class="[(product.isDisableSelect ? 'is-storno' : '')]"
              @click="handleClickOrderIncluded(product)">
              <span class="list-item-title">
                {{product.name}}
              </span>
              <span class="list-item-num">
                {{product.totalAmount}} €
              </span>
              <div class="change-products-payment">
                <div class="change-btn remove-btn"></div>
              </div>
            </li>
          </ul>
          <div class="products-payment-scroll-box">
            <div class="scroll-btn scroll-down" @click="handleScrollList('down', 'includedList')">
              <span class="icon-arrow-thick-down"></span>
            </div>
            <div class="scroll-btn scroll-up" @click="handleScrollList('up', 'includedList')">
              <span class="icon-arrow-thick-up"></span>
            </div>
          </div>
        </div>
        <div class="products-payment-box excluded-box">
          <p>Excluded:</p>
          <ul class="products-payment-list" ref="excludedList">
            <li class="list-item"
              v-for="product in orderForShow.orderExcluded"
              :key="product.ref"
              @click="handleClickOrderExcluded(product)">
              <span class="list-item-title">
                {{product.name}}
              </span>
              <span class="list-item-num">
                {{product.totalAmount}}€
              </span>
              <div class="change-products-payment">
                <div class="change-btn add-btn"></div>
              </div>
            </li>
          </ul>
          <div class="products-payment-scroll-box">
            <div class="scroll-btn scroll-down" @click="handleScrollList('down','excludedList')">
              <span class="icon-arrow-thick-down"></span>
            </div>
            <div class="scroll-btn scroll-up" @click="handleScrollList('up','excludedList')">
              <span class="icon-arrow-thick-up"></span>
            </div>
          </div>
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
        currentItemScrollTo: 0,
      }
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected,
        allTablesData: state => state.table.allTablesData,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        tableOrdered: state => state.table.tableOrdered
      }),

      orderForShow() {
        let tableTmp = {};

        for(let table of this.allTablesData) {
          if(this.orderSelected.tableCode == table.code) {
            tableTmp = {...table};
            break;
          }
        }

        return {
          tableName: tableTmp.name,
          totalPrice: this.orderSelected.totalPrice * 100,
          orderIncluded: this.orderSelected.orderIncluded,
          orderExcluded: this.orderSelected.orderExcluded
        }
      },

      orderInfo() {
        return {
          moneyToPay: Number(this.orderSelected.moneyToPay) * 100,
          moneyGiven: Number(this.orderSelected.moneyGiven) * 100,
          moneyChange: Number(this.orderSelected.moneyChange) * 100,
          orderDiscountType: this.orderSelected.orderDiscountType,
          orderDiscountValue: this.orderSelected.orderDiscountType == '%' ? this.orderSelected.orderDiscountValue : Number(this.orderSelected.orderDiscountValue) * 100,
          isOrderTogo: this.orderSelected.isOrderTogo
        }
      }
    },

    components: {},

    methods: {
      getData() {
        if(!globalFunction.checkValid(this.tableOrdered.code)) {
          let tableLS = localStorage.getItem('tableOrdered');

          tableLS = JSON.parse(tableLS);
          this.$store.commit('table/setTableOrdered', tableLS);
        }
      },

      handleClickOrderIncluded(product) {
        let tmpOrderSelected = {...this.orderSelected};

        if(!product.isDisableSelect && tmpOrderSelected.orderIncluded.length > 1) {
          for(let i = 0; i < tmpOrderSelected.orderIncluded.length; i++) {
            if(product.code == tmpOrderSelected.orderIncluded[i].code && !product.isDisableSelect) {
              tmpOrderSelected.orderIncluded.splice(i, 1);
              tmpOrderSelected.orderExcluded.unshift(product);

              break;
            }
          }

          // update order selected và orders
          this.updateOrder(tmpOrderSelected);
        }
      },

      handleClickOrderExcluded(product) {
        let tmpOrderSelected = {...this.orderSelected};

        for(let i = 0; i < tmpOrderSelected.orderExcluded.length; i++) {
          if(product.code == tmpOrderSelected.orderExcluded[i].code) {
            tmpOrderSelected.orderExcluded.splice(i, 1);
            tmpOrderSelected.orderIncluded.unshift(product);

            break;
          }
        }

        // update order selected và orders
        this.updateOrder(tmpOrderSelected);
      },

      updateOrder(orderTmp) {
        let tmpOrderIncluded = [...orderTmp.orderIncluded];
        let totalPrice = 0;
        let totalPriceWithoutDiscount = 0;

        for(let orderLine of tmpOrderIncluded) {
          totalPrice += Number(orderLine.totalAmount);
          totalPriceWithoutDiscount += Number(orderLine.priceOrigin) * Number(orderLine.quantity);
        }

        orderTmp.orderDiscountValue = 0;
        orderTmp.moneyToPay = totalPrice;
        orderTmp.moneyGiven = totalPrice;
        orderTmp.totalPrice = totalPrice;
        orderTmp.moneyChange = 0;
        orderTmp.totalPriceWithoutDiscount = totalPriceWithoutDiscount;

        for(let order of this.orders) {
          if(order.ref == orderTmp.ref) {
            order.orderIncluded = [...orderTmp.orderIncluded];
            order.orderExcluded = [...orderTmp.orderExcluded];
            order.orderDiscountValue = orderTmp.orderDiscountValue;
            order.moneyToPay = orderTmp.moneyToPay;
            order.moneyGiven = orderTmp.moneyGiven;
            order.totalPrice = orderTmp.totalPrice;
            order.moneyChange = orderTmp.moneyChange;
            order.totalPriceWithoutDiscount = orderTmp.totalPriceWithoutDiscount;
          }
        }

        this.$store.commit('order/setOrderSelected', orderTmp);
        this.$store.commit('order/setOrders', this.orders);

        // console.log(this.orderSelected);
      },

      handleScrollList(direction, listEle) {
        let list;
        let nextScroll = 50;

        if (listEle === 'includedList') {
          list = this.$refs.includedList;
        } else if (listEle === 'excludedList') {
          list = this.$refs.excludedList;
        }

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
    },

    created() {
      this.getData();
    }
  };
</script>