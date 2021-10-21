<template>
  <div class="body-wrapper">
    <Header />
    <div
      class="list-order-wrapper"
      :class="{ 'on-smallscreen': isOnSmallScreen }"
    >
      <div class="list-order-toolbar">
        <div class="row-toolbar search-box">
          <div class="search-icon-wrap">
            <span class="icon-search"></span>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm"
            class="input-search"
            id="input-search-list-ordered"
            @input="onInputChange"
            @focus="showHideSearchListKeyboard($event, true)"
          />
          <div class="reset-btn" @click="clearInput()">
            <span class="icon-close"></span>
          </div>
        </div>
        <datepicker
          v-model="date"
          :format="formatDate"
          class="row-toolbar datepicker-common"
        ></datepicker>
        <div class="row-toolbar routing-btn-box" @click="goBack()">
          <span>Hủy</span>
          <span class="icon-cheveron-right"></span>
        </div>
      </div>
      <div class="product-list-box" ref="orderListBox">
        <div class="product-list-wrapper">
          <div class="row-header">
            <ul class="row-pl">
              <li class="col-pl small-type">
                <div class="col-pl-data">
                  Benutzer
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Auftragsdatum
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Beleg
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Gesamt
                </div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  Zahlungsmethode
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Status
                </div>
              </li>
            </ul>
          </div>
          <div class="row-body" ref="rowBody">
            <ul
              class="row-pl"
              v-for="(order, index) in tempOrders"
              :key="index"
              ref="rowData"
              @click="handleClickToOrder(order.ref)"
            >
              <li class="col-pl small-type">
                <div class="col-pl-data">
                  {{ order._user }}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  {{ order._endTime }}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  {{ order._beleg }}
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">{{ order._moneyToPay }} €</div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  <span v-if="order._isCash">Barzahlung</span>
                  <span v-if="!order._isCash">Kartenzahlung</span>
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Verkauf
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="scroll-btn-box">
          <div class="scroll-btn scroll-up" @click="handleScrollList('up')">
            <span class="icon-arrow-thick-up"></span>
          </div>
          <div class="scroll-btn scroll-down" @click="handleScrollList('down')">
            <span class="icon-arrow-thick-down"></span>
          </div>
        </div>
      </div>
    </div>
    <KeyboardSearchList
      @onChange="onChange"
      :inputSelected="inputSelected"
      :inputNameSelected="inputNameSelected"
      :inputValueSelected="inputValueSelected"
      :input="input"
      ref="keyboard"
    />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import KeyboardSearchList from "@/components/elements/keyboard/KeyboardSearchList.vue";
import { globalFunction } from "@/global/global.js";
import { constants } from "@/global/constants.js";
import { mapState } from "vuex";
import Datepicker from "vuejs-datepicker";
import OrderService from "@/services/OrderService.js";
import UserDataService from "@/mixins/UserDataService";
import OrdersDataService from "@/mixins/OrdersDataService";
import UserService from "@/services/UserService.js";

export default {
  mixins: [UserDataService, OrdersDataService],

  components: {
    Datepicker,
    Header: Header,
    KeyboardSearchList: KeyboardSearchList,
  },

  data() {
    return {
      date: new Date(),
      formatDate: "dd-MM-yyyy",
      currentItemScrollTo: 0,
      queryUrl: "",

      // biến bàn phím ảo
      input: "",
      inputNameSelected: "",
      inputValueSelected: "",
      inputSelected: "",
    };
  },

  computed: {
    ...mapState({
      user: (state) => state.user.user,
      users: (state) => state.user.users,
      listOrders: (state) => state.listOrder.listOrders,
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      orders: (state) => state.order.orders,
      orderSelected: (state) => state.order.orderSelected,
      tempOrders: (state) => state.listOrder.tempOrders,
    }),

    listOrdersForShow() {
      let orders = globalFunction.deepCloneObj(this.listOrders);
      // console.log('orders:', orders);

      orders = orders.reduce((orders, order) => {
        switch (this.queryUrl) {
          case "verkaufs":
            order._user = this.users.filter(
              (user) => user.username == order.userCode
            )[0].fullname;
            order._beleg = order.beleg;
            order._endTime = this.$moment
              .unix(Number(order.endTime) / 1000)
              .format("DD-MM-YYYY HH:MM:ss");
            order._moneyToPay = Number(order.moneyToPay).toFixed(2);
            order._isCash = order.is_cash;

            orders.push(order);
            break;

          case "retour":
            if (Number(order.moneyToPay) > 0 && order.retourState != "all") {
              order._user = this.users.filter(
                (user) => user.username == order.userCode
              )[0].fullname;
              order._beleg = order.beleg;
              order._endTime = this.$moment
                .unix(Number(order.endTime) / 1000)
                .format("DD-MM-YYYY HH:MM:ss");
              order._moneyToPay = Number(order.moneyToPay).toFixed(2);
              order._isCash = order.is_cash;

              orders.push(order);
            }
            break;

          case "reload":
            if (Number(order.moneyToPay) > 0) {
              order._user = this.users.filter(
                (user) => user.username == order.userCode
              )[0].fullname;
              order._beleg = order.beleg;
              order._endTime = this.$moment
                .unix(Number(order.endTime) / 1000)
                .format("DD-MM-YYYY HH:MM:ss");
              order._moneyToPay = Number(order.moneyToPay).toFixed(2);
              order._isCash = order.is_cash;

              orders.push(order);
            }
            break;
        }
        return orders;
      }, []);
      // console.log('orders:', orders);
      return orders;
    },
  },

  watch: {
    date() {
      this.getListOrders();
    },
  },

  methods: {
    handleHeightListBox() {
      let hBlockFooter = 0;
      globalFunction.handleHeightListBox(
        this.$refs.orderListBox,
        this.$refs.rowBody,
        this.$refs.rowData,
        this.tempOrders.length - 1,
        hBlockFooter,
        "large"
      );
      this.currentItemScrollTo = 0;
      this.$refs.rowBody.scrollTop = 0;
    },

    handleScrollList(direction) {
      let list = this.$refs.rowBody;
      let nextScroll = 200;

      this.currentItemScrollTo = list.scrollTop;

      switch (direction) {
        case "down":
          this.currentItemScrollTo += nextScroll;
          list.scrollTop = this.currentItemScrollTo;
          if (list.scrollTop < this.currentItemScrollTo) {
            this.currentItemScrollTo = list.scrollTop;
          }
          break;
        case "up":
          this.currentItemScrollTo -= nextScroll;
          list.scrollTop = this.currentItemScrollTo;
          break;
        default:
          break;
      }
    },

    goBack() {
      switch (this.queryUrl) {
        case "reload":
          this.$router.push({ path: "/home" });
          break;

        case "verkaufs":
          this.$router.push({ path: "/table" });
          break;

        case "retour":
          this.$router.push({ path: "/table" });
          break;
      }
    },

    handleClickToOrder(orderRef) {
      switch (this.queryUrl) {
        case "reload":
          this.$router.push({ path: `/reload-details/${orderRef}` });
          break;

        case "verkaufs":
          this.handleVerkaufsDetails(orderRef);
          break;

        case "retour":
          this.$router.push({ path: `/retour-details/${orderRef}` });
          break;
      }
    },

    getListOrders() {
      let dateFrom = this.$moment(this.date).format(
        constants.FORMAT_DATE_FOR_API
      );

      this.$store.commit("helper/showLoading", true);

      UserService.getAll().then(() => {
        OrderService.getOrdersByDate(
          this.user.username,
          dateFrom,
          dateFrom
        ).then((res) => {
          this.$store.commit("listOrder/setListOrdersData", res);

          this.$nextTick(() => {
            this.$store.commit(
              "listOrder/setListOrdersForShowOriginal",
              this.listOrdersForShow
            );
            this.$store.commit("listOrder/setTempOrders");

            setTimeout(() => {
              this.handleHeightListBox();
            }, 0);
          });
          this.$store.commit("helper/showLoading", false);
        });
      });

      // clear input
      this.input = "";
      this.$store.dispatch("helper/hideAllKeyboard");
    },

    detectQueryUrl() {
      this.queryUrl = this.$route.query.type;
    },

    handleVerkaufsDetails(orderRef) {
      let orderTmp = {};
      let ordersTmp = globalFunction.deepCloneObj(this.orders);

      for (let i = 0; i < ordersTmp.length; i++) {
        ordersTmp[i].isActive = false;
      }

      for (let i = 0; i < this.listOrders.length; i++) {
        if (this.listOrders[i].ref == orderRef) {
          orderTmp = globalFunction.deepCloneObj(this.listOrders[i]);
          orderTmp.isActive = true;
        }
      }

      this.$store.commit("helper/showLoading", true);
      OrderService.getOrderByRef(orderTmp.ref).then((res) => {
        // console.log('res:', res);
        let orderLinesTmp = JSON.parse(res.orderlines);

        orderTmp.orderLines = orderLinesTmp;
        ordersTmp.push(orderTmp);
        this.$store.commit("order/setOrderSelected", orderTmp);
        this.$store.commit("order/setOrders", ordersTmp);
        // console.log('orderTmp:', this.orderSelected);
        // console.log('ordersTmp:', ordersTmp);

        // chuyển đến page print
        OrderService.save().then(() => {
          this.$store.commit("helper/showLoading", false);
          this.$router.push({ path: "/print", query: { type: "verkaufs" } });
        });
      });
    },

    // method bàn phím ảo
    showHideSearchListKeyboard(e, value) {
      if (!this.$device.android && !this.$device.ios) {
        this.$store.dispatch("helper/updateKeyboardState", value);
        this.$store.dispatch("helper/showHideSearchListKeyboard", value);

        this.inputSelected = `#${e.target.id}`;
        this.inputNameSelected = e.target.id;

        setTimeout(() => {
          this.$refs.keyboard.setInputName();
          this.$refs.keyboard.handleHeightCloseButton();
        }, 0);
      }
    },

    onChange(input) {
      this.input = input;
      document.querySelector(this.inputSelected).value = input;
      this.$store.dispatch("listOrder/searchListOrder", this.input);

      // handle height
      setTimeout(() => {
        this.handleHeightListBox();
      }, 0);
    },

    onInputChange(e) {
      // tracking các input change được tạo ra không phải từ bàn phím ảo
      this.input = e.target.value;
      this.inputValueSelected = e.target.value;
      this.$store.dispatch("listOrder/searchListOrder", this.input);

      setTimeout(() => {
        this.$refs.keyboard.setInputValue();

        // handle height
        this.handleHeightListBox();
      }, 0);
    },

    clearInput() {
      this.input = "";
      this.$refs.keyboard.clearInput();
      document.querySelector(this.inputSelected).value = "";
      this.$store.dispatch("listOrder/searchListOrder", this.input);

      // handle height
      setTimeout(() => {
        this.handleHeightListBox();
      }, 0);
    },
  },

  created() {
    this.getListOrders();
    this.$store.dispatch("helper/hideAllKeyboard");
    this.detectQueryUrl();
  },

  mounted() {},
};
</script>
