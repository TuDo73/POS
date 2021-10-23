<template>
  <div class="body-wrapper">
    <Header />
    <div class="return-wrapper" v-if="isComponentReady">
      <div class="toolbar-header">
        <div class="routing-btn-box" @click="backToListOrdered()">
          <span class="icon-cheveron-left"></span>
          <span>Back</span>
        </div>
      </div>
      <div class="return-box" :class="{ 'on-smallscreen': isOnSmallScreen }">
        <div class="return-info">
          <div class="return-heading reload-box">
            <p>ORDER DETAILS</p>
            <div class="return-btn-top">
              <div class="return-btn return-all" @click="reloadAll()">
                <span>
                  PHỤC HỒI
                </span>
              </div>
            </div>
          </div>
          <div class="return-details return-details-top">
            <div class="row-details">
              <div class="col-details">
                <span>Beleg: </span>
                <span>
                  {{ orderForShow.orderData.beleg }}
                </span>
              </div>
              <div class="col-details">
                <span>Date: </span>
                <span>
                  {{ orderForShow.orderData.endTime }}
                </span>
              </div>
            </div>
            <div class="row-details">
              <div class="col-details">
                <span>Customer: </span>
                <span>
                  {{ orderForShow.orderData.customer_code }}
                </span>
              </div>
              <div class="col-details">
                <span>Return/Refund: </span>
                <span>{{ orderForShow.orderData.retourState }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="return-body">
          <div class="return-data-box" ref="returnDataBox">
            <div class="row-data-header">
              <div class="row-data">
                <div class="col-data">
                  Product
                </div>
                <div class="col-data">
                  Quantity
                </div>
                <div class="col-data">
                  Returns
                </div>
                <div class="col-data">
                  Remain
                </div>
                <div class="col-data">
                  Unit price
                </div>
                <div class="col-data">
                  Discount(€)
                </div>
                <div class="col-data">
                  Total
                </div>
                <div class="col-data ">
                  Check
                </div>
              </div>
            </div>
            <div class="row-data-body" ref="rowBody">
              <div
                class="row-data"
                v-for="(orderline, index) in orderForShow.orderlines"
                :key="index"
                ref="rowData"
              >
                <div class="col-data">
                  {{ orderline.name }}
                </div>
                <div class="col-data">
                  {{ orderline.quantity }}
                </div>
                <div class="col-data">
                  {{ orderline.retourQuantity }}
                </div>
                <div class="col-data">
                  {{ orderline.remainQuantity }}
                </div>
                <div class="col-data">{{ orderline.price }}€</div>
                <div class="col-data">
                  {{ orderline.discount }}
                </div>
                <div class="col-data">{{ orderline.totalAmount }}€</div>
                <div class="col-data">
                  <label class="check-input">
                    <input
                      type="checkbox"
                      @change="handleChangeCheckbox($event, index)"
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </div>
              <div
                class="return-scroll-btn scroll-up"
                @click="handleScrollList('up')"
              >
                <span class="icon-arrow-thick-up"></span>
              </div>
              <div
                class="return-scroll-btn scroll-down"
                @click="handleScrollList('down')"
              >
                <span class="icon-arrow-thick-down"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="return-btn-wrap" ref="btnFooter">
          <div class="return-btn return-single" @click="reloadProducts()">
            <span>PHỤC HỒI SẢN PHẨM</span>
          </div>
        </div>
        <div class="return-info-wrap" ref="infoFooter">
          <div class="return-info">
            <div class="return-details">
              <div class="row-details">
                <div class="col-details">
                  <span>Payment modes: </span>
                  <span v-if="orderForShow.orderData.is_cash">Barzahlung</span>
                  <span v-if="!orderForShow.orderData.is_cash"
                    >Kartenzahlung</span
                  >
                </div>
                <div class="col-details">
                  <span>Giảm giá hóa đơn: </span>
                  <span>
                    {{ orderForShow.orderData.orderDiscountValue }}€
                  </span>
                </div>
                <div class="col-details">
                  <span class="col-total">Total: </span>
                  <span>{{ orderForShow.orderData.moneyToPay }}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";
import Header from "@/components/Header.vue";
import OrderService from "@/services/OrderService.js";

export default {
  components: {
    Header: Header,
  },

  data() {
    return {
      orderRefId: "",
      isComponentReady: false,
      currentItemScrollTo: 0,
      isValidReloads: false,
    };
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      order: (state) => state.listOrder.order,
      orderSelected: (state) => state.order.orderSelected,
      orders: (state) => state.order.orders,
      user: (state) => state.user.user,
    }),

    orderForShow() {
      let order = globalFunction.deepCloneObj(this.order);

      order.orderlines = JSON.parse(order.orderlines);
      order.orders = JSON.parse(order.orders);

      for (let i = order.orderlines.length; i--; ) {
        order.orderlines[i].retourQuantity =
          order.orderlines[i].retourQuantity == ""
            ? 0
            : order.orderlines[i].retourQuantity;
        order.orderlines[i].remainQuantity =
          order.orderlines[i].remainQuantity == ""
            ? order.orderlines[i].quantity
            : order.orderlines[i].remainQuantity;

        if (order.orderlines[i].isDisableSelect) {
          // xóa những món storno ra khỏi orderlines
          order.orderlines.splice(i, 1);
        }
      }

      if (globalFunction.checkValid(order.orders[0])) {
        order.orderData = order.orders[0];
        order.orderData.endTime = this.$moment
          .unix(Number(order.orderData.endTime) / 1000)
          .format("DD.MM.YYYY");
        order.orderData.customer_code = globalFunction.checkValid(
          order.orderData.customer_code
        )
          ? order.orderData.customer_code
          : "-";
        order.orderData.moneyToPay = Number(order.orderData.moneyToPay).toFixed(
          2
        );
        order.orderData.orderDiscountValue = Number(
          order.orderData.orderDiscountValue
        ).toFixed(2);
      }

      return order;
    },
  },

  methods: {
    backToListOrdered() {
      this.$router.push({ path: "/list-ordered", query: { type: "reload" } });
    },

    getData() {
      this.isComponentReady = false;
      this.$store.commit("helper/showLoading", true);

      OrderService.getOrderByRef(this.orderRefId).then((res) => {
        this.resOrder = res;
        this.$store.commit("listOrder/setOrder", res);
        this.isComponentReady = true;

        this.$nextTick(() => {
          let hBlockFooter =
            this.$refs.btnFooter.getBoundingClientRect().height +
            this.$refs.infoFooter.getBoundingClientRect().height;
          globalFunction.handleHeightListBox(
            this.$refs.returnDataBox,
            this.$refs.rowBody,
            this.$refs.rowData,
            this.orderForShow.orderlines.length - 1,
            hBlockFooter,
            "small"
          );
          this.currentItemScrollTo = 0;
          this.$refs.rowBody.scrollTop = 0;
        });
        this.$store.commit("helper/showLoading", false);
      });
    },

    handleScrollList(direction) {
      let list = this.$refs.rowBody;
      let nextScroll = 50;

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

    checkOrderSelected() {
      if (!globalFunction.checkValid(this.orderSelected.ref)) {
        this.$router.push({ path: "/home" });
      } else {
        this.getData();
      }
    },

    reloadAll() {
      let ordersTmp = this.orders;

      this.orderSelected.orderLines = this.orderForShow.orderlines;
      for (let i = 0; i < this.orderSelected.orderLines.length; i++) {
        this.orderSelected.orderLines[i].isOrderConfirmed = false;
      }
      this.$store.commit("order/setOrderSelected", this.orderSelected);
      this.$store.dispatch("order/calculateOrder");

      for (let i = 0; i < ordersTmp.length; i++) {
        ordersTmp[i].isActive = false;
      }

      ordersTmp.push(this.orderSelected);
      this.$store.commit("order/setOrders", ordersTmp);

      this.$store.commit("helper/showLoading", true);
      OrderService.save().then(() => {
        this.$store.commit("helper/showLoading", false);
        this.$router.push({ path: "/home" });
      });
    },

    reloadProducts() {
      if (!this.isValidReloads) {
        this.$store.dispatch("popup/updatePopupState", true);
        this.$store.dispatch("order/showHidePopupAlertSelectProduct", true);
        return;
      }

      let orderLinesTmp = this.orderForShow.orderlines;
      let ordersTmp = this.orders;

      for (let i = 0; i < orderLinesTmp.length; i++) {
        if (orderLinesTmp[i].isSelectedToRepeat) {
          orderLinesTmp[i].isSelectedToRepeat = false;
          orderLinesTmp[i].isOrderConfirmed = false;
          this.orderSelected.orderLines.push(orderLinesTmp[i]);
        }
      }
      this.$store.commit("order/setOrderSelected", this.orderSelected);
      this.$store.dispatch("order/calculateOrder");

      for (let i = 0; i < ordersTmp.length; i++) {
        ordersTmp[i].isActive = false;
      }

      ordersTmp.push(this.orderSelected);
      this.$store.commit("order/setOrders", ordersTmp);

      this.$store.commit("helper/showLoading", true);
      OrderService.save().then(() => {
        this.$store.commit("helper/showLoading", false);
        this.$router.push({ path: "/home" });
      });
    },

    handleChangeCheckbox(event, index) {
      let orderLinesTmp = this.orderForShow.orderlines;

      for (let i = 0; i < orderLinesTmp.length; i++) {
        if (i == index) {
          orderLinesTmp[i].isSelectedToRepeat = !orderLinesTmp[i]
            .isSelectedToRepeat;
        }
      }

      this.checkValidReloadProducts();
    },

    checkValidReloadProducts() {
      this.isValidReloads = false;

      let orderLinesTmp = this.orderForShow.orderlines;

      for (let i = 0; i < orderLinesTmp.length; i++) {
        if (orderLinesTmp[i].isSelectedToRepeat) {
          this.isValidReloads = true;
          break;
        }
      }
    },
  },

  created() {
    this.isValidReloads = false;
    this.orderRefId = this.$route.params.id;
    this.$store.dispatch("helper/hideAllKeyboard");

    this.checkOrderSelected();
  },

  mounted() {},
};
</script>
