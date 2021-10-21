<template>
  <div class="payment-details-wrap">
    <div class="payment-details" v-if="!isOnSmallScreen">
      <div class="payment-details-heading">
        <div class="total-payment">
          <div class="total-payment-title">To Pay:</div>
          <div class="total-payment-num">{{orderInfo.moneyToPay | centToEuroFormat}}</div>
        </div>
        <div class="btn-payment-type" v-if="isPaymentCash" @click="changePaymentType(false)">
          <div class="btn-payment-type-img type-card"></div>
          <div class="btn-payment-type-title">Trả thẻ</div>
        </div>
        <div class="btn-payment-type" v-if="!isPaymentCash" @click="changePaymentType(true)">
          <div class="btn-payment-type-img type-cash"></div>
          <div class="btn-payment-type-title">Tiền mặt</div>
        </div>
      </div>
      <div class="payment-option">
        <div class="col-left">
          <div class="row-option discount-option" @click="handleDiscountOrder()">
            <div class="option-btn-wrap height-payment-btn box-shadow-btn">
              <div class="option-btn left-btn eur-btn"
                :class="{'is-active' : orderInfo.orderDiscountType === '€'}">
                Discount in EUR
              </div>
              <div class="option-btn right-btn percent-btn"
                :class="{'is-active' : orderInfo.orderDiscountType === '%'}">
                Discount in %
              </div>
            </div>
          </div>
          <div class="row-option place-option">
            <div class="option-btn-wrap height-payment-btn box-shadow-btn">
              <div class="option-btn left-btn eat-here-btn"
                :class="{'is-active' : !orderInfo.isOrderTogo}">Eat here</div>
              <div class="option-btn right-btn to-go-btn"
                :class="{'is-active' : orderInfo.isOrderTogo}">To-go</div>
            </div>
          </div>
          <div class="row-option gegeben-wrap">
            <div class="gegeben-box height-payment-btn box-shadow-btn">
              <span class="gegeben-title">Given:</span>
              <span class="gegeben-num">{{orderInfo.moneyGiven | centToEuroFormat}}</span>
            </div>
          </div>
        </div>
        <div class="col-right">
          <div class="discount-input height-payment-btn box-shadow-btn"
            v-if="orderInfo.orderDiscountType === '€'">
            {{orderInfo.orderDiscountValue | centToEuroFormat}}
          </div>
          <div class="discount-input height-payment-btn box-shadow-btn"
            v-if="orderInfo.orderDiscountType === '%'">
            {{orderInfo.orderDiscountValue}}%
          </div>
          <div class="change-box height-payment-btn box-shadow-btn">
            <span>Change:</span>
            <span class="change-num">{{orderInfo.moneyChange | centToEuroFormat}}</span>
          </div>
        </div>
      </div>
      <div class="money-box type-cash" v-if="isPaymentCash">
        <div class="wrapper">
          <ul class="coin-row">
            <li class="coin-item" @click="clickMoney('0.01')">
              <span>
                <img src="@/assets/images/money/1cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('0.02')">
              <span>
                <img src="@/assets/images/money/2cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('0.05')">
              <span>
                <img src="@/assets/images/money/5cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('0.1')">
              <span>
                <img src="@/assets/images/money/10cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('0.2')">
              <span>
                <img src="@/assets/images/money/20cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('0.5')">
              <span>
                <img src="@/assets/images/money/50cent.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('1')">
              <span>
                <img src="@/assets/images/money/1euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('2')">
              <span>
                <img src="@/assets/images/money/2euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
          </ul>
          <ul class="coin-row money-paper-row">
            <li class="coin-item" @click="clickMoney('5')">
              <span>
                <img src="@/assets/images/money/5euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('10')">
              <span>
                <img src="@/assets/images/money/10euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('20')">
              <span>
                <img src="@/assets/images/money/20euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('50')">
              <span>
                <img src="@/assets/images/money/50euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('100')">
              <span>
                <img src="@/assets/images/money/100euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item" @click="clickMoney('200')">
              <span>
                <img src="@/assets/images/money/200euro.png"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="money-box type-card" v-if="!isPaymentCash">
        <div class="wrapper">
          <ul class="coin-row">
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-g.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-visa.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-electronic.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-apple.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-amex.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
            <li class="coin-item">
              <span>
                <img src="@/assets/images/card/card-master.jpg"/>
                <div class="overlay-coin-btn"></div>
              </span>
            </li>
          </ul>
        </div>
      </div> 
    </div>

    <div class="payment-details-smallscreen" v-if="isOnSmallScreen">
      <div class="payment-option-list">
        <div class="option-item box-shadow-btn" style="height: 20%" @click="handleDiscountOrder()">
          <div class="option-btn top-btn" :class="{'is-active' : orderInfo.orderDiscountType === '€'}">
            Discount in EUR
          </div>
          <div class="option-btn bottom-btn" :class="{'is-active' : orderInfo.orderDiscountType === '%'}">
            Discount in %
          </div>
        </div>
        <div class="option-item box-shadow-btn" style="height: 20%">
          <div class="option-btn top-btn" :class="{'is-active' : !orderInfo.isOrderTogo}">
            Eat here
          </div>
          <div class="option-btn bottom-btn" :class="{'is-active' : orderInfo.isOrderTogo}">
            To-go
          </div>
        </div>
        <div class="option-item box-shadow-btn" style="height: 30%">
          <div class="option-btn top-btn">
            No Receipt
          </div>
          <div class="option-btn mid-btn is-active">
            With Receipt
          </div>
          <div class="option-btn bottom-btn">
            Bewirtung
          </div>
        </div>
        <div class="option-item customer-btn box-shadow-btn" style="height: 15%">
          <div class="option-btn">
            Add Customer
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
        clickedMoney: false
      }
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected,
        discountLocation: state => state.helper.discountLocation,
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        isPaymentCash: state => state.helper.isPaymentCash
      }),

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
      changePaymentType(value) {
        this.$store.commit('helper/setPaymentType', value);
      },

      clickMoney(value) {
        let tmpOrderSelected = {...this.orderSelected};
        let moneyGivenTmp = tmpOrderSelected.moneyGiven;
        let moneyChangeTmp = tmpOrderSelected.moneyChange;
        let moneyToPayTmp = tmpOrderSelected.moneyToPay;

        if(!this.clickedMoney) {
          moneyGivenTmp = value;
        } else {
          moneyGivenTmp = Number(moneyGivenTmp) + Number(value);
        }

        moneyChangeTmp = Number(moneyGivenTmp) - Number(moneyToPayTmp);
        this.clickedMoney = true;

        tmpOrderSelected.moneyGiven = moneyGivenTmp;
        tmpOrderSelected.moneyChange = moneyChangeTmp;

        // update order selected và orders
        for(let order of this.orders) {
          if(order.ref == tmpOrderSelected.ref) {
            order.moneyGiven = moneyGivenTmp;
            order.moneyChange = moneyChangeTmp;
          }
        }

        this.$store.commit('order/setOrderSelected', tmpOrderSelected);
        this.$store.commit('order/setOrders', this.orders);
      },

      handleDiscountOrder() {
        this.$store.commit('helper/setStateValidDiscountValue', true);
        this.$store.commit('order/setValueDiscount', '');
        this.$store.commit('order/setDiscountType', false);
        this.$store.dispatch('popup/updatePopupState', true);
        this.$store.dispatch('order/showHidePopupDiscount', true);
      }
    },

    created() {
      this.$store.commit('helper/setPaymentType', true);
    }
  };
</script>