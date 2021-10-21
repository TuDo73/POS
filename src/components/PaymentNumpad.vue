<template>
  <div class="payment-numpad">
    <div class="numpad">
      <div class="number-box">
        <ul class="number-list">
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('7')">
              <span>7</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('8')">
              <span>8</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('9')">
              <span>9</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('4')">
              <span>4</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('5')">
              <span>5</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('6')">
              <span>6</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('1')">
              <span>1</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('2')">
              <span>2</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('3')">
              <span>3</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('clear')">
              <span>C</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('0')">
              <span>0</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn" @click="clickNumBtn('00')">
              <span>00</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item very-large-type">
            <div class="number-btn" @click="clickNumBtn('delete')">
              <span class="icon-arrow-thick-left"></span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item very-large-type">
            <div class="number-btn" @click="clickNumBtn('reset')">
              <span>= Price</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
        </ul>
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
      }
    },

    computed: {
      ...mapState({
        orders: state => state.order.orders,
        orderSelected: state => state.order.orderSelected
      }),
    },

    methods: {
      clickNumBtn(value) {
        if(value === 'clear') {
          this.orderSelected.moneyGiven = 0;

          this.calculateMoney();

          return;
        }

        if(value === 'delete') {
          let strTmp = Number(this.orderSelected.moneyGiven).toString();

          if(strTmp !== '0') {
            strTmp = strTmp.slice(0, -1);
            if(strTmp == '') {
              strTmp = 0;
            }
            this.orderSelected.moneyGiven = strTmp;
            this.calculateMoney();
          }

          return;
        }

        if(value === 'reset') {
          this.orderSelected.moneyGiven = this.orderSelected.moneyToPay;
          this.calculateMoney();

          return;
        }

        if(value === '0' || value === '00') {
          if(this.orderSelected.moneyGiven == '0') {
            this.orderSelected.moneyGiven = 0;

            return;
          }
        }

        this.orderSelected.moneyGiven = this.orderSelected.moneyGiven.toString() + value;
        this.calculateMoney();
      },

      calculateMoney() {
        this.orderSelected.moneyChange = Number(this.orderSelected.moneyGiven) - Number(this.orderSelected.moneyToPay);
        
        for(let order of this.orders) {
          if(order.ref == this.orderSelected.ref) {
            order.moneyGiven = this.orderSelected.moneyGiven;
            order.moneyChange = this.orderSelected.moneyChange;
            order.moneyToPay = this.orderSelected.moneyToPay;
          }
        }
        this.$store.commit('order/setOrders', this.orders);
      }
    },

    created() {
    }
  };
</script>