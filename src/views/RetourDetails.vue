<template>
  <div
    class="body-wrapper"
    :class="{ 'is-open-keyboard-retour': isOpenKeyboardRetour }"
  >
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
          <div class="return-heading retour-box">
            <p>Thông tin hóa đơn</p>
            <div class="return-btn-top">
              <div
                class="return-btn return-all"
                @click="doRetourProducts(true)"
              >
                <span>Trả toàn bộ đơn hàng</span>
              </div>
              <div class="return-btn" @click="doRetourProducts()">
                <span>
                  Xác nhận trả hàng
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
                  -
                </span>
              </div>
              <div class="col-details">
                <span>Trả hàng: </span>
                <span>
                  {{ orderForShow.orderData.retourState || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="return-body">
          <div class="return-data-box" ref="returnDataBox">
            <div class="row-data-header">
              <div class="row-data">
                <div class="col-data">
                  Sản phẩm
                </div>
                <div class="col-data">
                  Số lượng
                </div>
                <div class="col-data col-type-1">
                  Hàng trả lại
                </div>
                <div class="col-data col-type-2">
                  Hàng còn lại
                </div>
                <div class="col-data">
                  Giá lẻ
                </div>
                <div class="col-data">
                  Giảm giá(€)
                </div>
                <div class="col-data">
                  Tổng tiền
                </div>
                <div class="col-data ">
                  Số lượng trả
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
                <div class="col-data col-type-1">
                  {{ orderline.retourQuantity }}
                </div>
                <div class="col-data col-type-2">
                  {{ orderline.remainQuantity }}
                </div>
                <div class="col-data">{{ orderline.price }}€</div>
                <div class="col-data">
                  {{ orderline.discount }}
                </div>
                <div class="col-data">{{ orderline.totalAmount }}€</div>
                <div class="col-data input-data">
                  <input
                    type="text"
                    :id="'input-' + index"
                    :data-input-productId="orderline.product_id"
                    @input="onInputChange"
                    @focus="showHideNumberKeyboard($event, true)"
                  />
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
          <div class="return-btn return-single" @click="doRetourProducts()">
            <span>Xác nhận trả hàng</span>
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
    <KeyboardNumber
      @onChange="onChangeKeyboard"
      :inputSelected="inputSelected"
      :inputNameSelected="inputNameSelected"
      :inputValueSelected="inputValueSelected"
      :input="input"
      ref="keyboard"
    />
  </div>
</template>
<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";
import Header from "@/components/Header.vue";
import KeyboardNumber from "@/components/elements/keyboard/KeyboardNumber.vue";
import OrderService from "@/services/OrderService.js";
import UserDataService from "@/mixins/UserDataService";
import OrdersDataService from "@/mixins/OrdersDataService";

export default {
  mixins: [UserDataService, OrdersDataService],

  components: {
    Header: Header,
    KeyboardNumber: KeyboardNumber,
  },

  data() {
    return {
      currentItemScrollTo: 0,
      orderRefId: "",
      isComponentReady: false,
      allRetourValue: [],
      newOrder: {},
      orderOrigin: {},
      itemDiscountValue: 0,

      // biến bàn phím ảo
      input: "",
      inputNameSelected: "",
      inputValueSelected: "",
      inputSelected: "",
    };
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      order: (state) => state.listOrder.order,
      orderSelected: (state) => state.order.orderSelected,
      user: (state) => state.user.user,
      isOpenKeyboardRetour: (state) => state.helper.isOpenKeyboardRetour,
      orders: (state) => state.order.orders,
      actionRetour: (state) => state.listOrder.actionRetour,
      retourReason: (state) => state.listOrder.retourReason,
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
        order.orderlines[i].discount = Number(
          order.orderlines[i].discount
        ).toFixed(2);

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

  watch: {
    actionRetour() {
      if (this.actionRetour) {
        // thực hiện tính toán và xử lý retour order sau khi nhập lý do retour
        this.setRetourOrder();
      }
    },
  },

  methods: {
    backToListOrdered() {
      this.$router.push({ path: "/list-ordered", query: { type: "retour" } });
    },

    getData() {
      this.isComponentReady = false;
      this.$store.commit("helper/showLoading", true);

      OrderService.getOrderByRef(this.orderRefId).then((res) => {
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

    validateValueInputRetour(inputProductId) {
      let currentInput = document.querySelector(
        `[data-input-productid="${inputProductId}"]`
      );
      let valueInput = currentInput.value;
      let currentRemain = 0;

      for (let i = 0; i < this.orderForShow.orderlines.length; i++) {
        if (this.orderForShow.orderlines[i].product_id == inputProductId) {
          currentRemain =
            this.orderForShow.orderlines[i].remainQuantity ||
            this.orderForShow.orderlines[i].quantity;

          break;
        }
      }

      if (Number(valueInput) > Number(currentRemain)) {
        valueInput = currentRemain;
      }
      currentInput.value = valueInput;
    },

    handleRetourValue() {
      let retourInputs = document.querySelectorAll("[data-input-productid]");

      this.allRetourValue = [];
      for (let i = 0; i < retourInputs.length; i++) {
        if (Number(retourInputs[i].value) > 0) {
          let objTmp = {};

          objTmp.productId = retourInputs[i].getAttribute(
            "data-input-productid"
          );
          objTmp.retourQuantity = retourInputs[i].value;

          this.allRetourValue.push(objTmp);
        }
      }
    },

    doRetourProducts(isRetourAll = false) {
      // close keyboard
      this.$store.dispatch("helper/hideAllKeyboard");
      this.$store.commit("helper/setStateOpenKeyboardRetour", false);

      this.handleRetourValue();

      let isValidToGo = true;
      let currentTime = new Date().getTime();
      let orderLinesTmp = [];
      let orderDiscountValue = 0;

      this.itemDiscountValue = 0;
      this.orderOrigin = globalFunction.deepCloneObj(
        JSON.parse(this.order.orders)[0]
      );
      this.newOrder = globalFunction.deepCloneObj(
        JSON.parse(this.order.orders)[0]
      );

      this.newOrder.ref = this.newOrder.userCode + currentTime;
      this.newOrder.startTime = currentTime;
      this.newOrder.retourFromRef = JSON.parse(this.order.orders)[0].ref;
      this.newOrder.retourFromBeleg = JSON.parse(this.order.orders)[0].beleg;
      this.newOrder.orderLines = [];
      this.newOrder.isActive = true;

      if (!isRetourAll) {
        // retour món lẻ
        if (this.allRetourValue.length > 0) {
          let orderLinesOrderOriginTmp = globalFunction.deepCloneObj(
            JSON.parse(this.order.orderlines)
          );
          let totalPrice = 0;
          let totalDiscountOrder = 0;
          let orderlinesForShowTmp = globalFunction.deepCloneObj(
            this.orderForShow.orderlines
          );

          // tính toán trường hợp order giảm giá tổng
          orderDiscountValue = this.orderForShow.orderData.orderDiscountValue;
          if (Number(orderDiscountValue) > 0) {
            let totalProducts = 0;

            for (let i = 0; i < orderlinesForShowTmp.length; i++) {
              totalProducts += Number(orderlinesForShowTmp[i].quantity);
            }
            this.itemDiscountValue = (
              Number(orderDiscountValue) / Number(totalProducts)
            ).toFixed(2);
          }

          for (let i = 0; i < this.allRetourValue.length; i++) {
            for (let j = 0; j < orderlinesForShowTmp.length; j++) {
              if (
                this.allRetourValue[i].productId ==
                orderlinesForShowTmp[j].product_id
              ) {
                let quantityTmp = orderlinesForShowTmp[j].quantity;
                let retourQuantityTmp = orderlinesForShowTmp[j].retourQuantity;
                let remainQuantityTmp = orderlinesForShowTmp[j].remainQuantity;

                if (orderlinesForShowTmp[j].isDiscount) {
                  orderlinesForShowTmp[j].discount =
                    ((Number(this.allRetourValue[i].retourQuantity) *
                      Number(orderlinesForShowTmp[j].discount)) /
                      Number(orderlinesForShowTmp[j].quantity)) *
                    -1;
                  orderlinesForShowTmp[j].price =
                    Number(orderlinesForShowTmp[j].price) * -1;
                  orderlinesForShowTmp[j].priceAfterChange =
                    Number(orderlinesForShowTmp[j].priceAfterChange) * -1;
                  orderlinesForShowTmp[j].priceOrigin =
                    Number(orderlinesForShowTmp[j].priceOrigin) * -1;
                }

                orderlinesForShowTmp[j].remainQuantity =
                  Number(quantityTmp) -
                  Number(this.allRetourValue[i].retourQuantity);
                orderlinesForShowTmp[j].retourQuantity =
                  Number(retourQuantityTmp != "" ? retourQuantityTmp : 0) +
                  Number(this.allRetourValue[i].retourQuantity);
                orderlinesForShowTmp[j].quantity = Number(
                  -this.allRetourValue[i].retourQuantity
                );

                if (Number(this.itemDiscountValue) > 0) {
                  // trường hợp có giảm giá tổng
                  orderlinesForShowTmp[j].totalAmount =
                    Number(orderlinesForShowTmp[j].totalAmount) -
                    Number(this.itemDiscountValue) *
                      Number(orderlinesForShowTmp[j].quantity);
                  totalPrice += orderlinesForShowTmp[j].totalAmount;
                  totalDiscountOrder +=
                    Number(this.itemDiscountValue) *
                    Number(orderlinesForShowTmp[j].quantity);
                }

                orderLinesTmp.push(orderlinesForShowTmp[j]);
              }
            }
          }
          this.newOrder.orderLines = orderLinesTmp;
          this.newOrder.orderIncluded = orderLinesTmp;
          this.newOrder.retourState = "products";
          if (this.itemDiscountValue > 0) {
            this.newOrder.moneyToPay = totalPrice;
            this.newOrder.orderDiscount = -totalDiscountOrder;
            this.newOrder.orderDiscountValue = -totalDiscountOrder;
            this.newOrder.total_discount = -totalDiscountOrder;
          }

          for (let i = 0; i < orderLinesOrderOriginTmp.length; i++) {
            if (!orderLinesOrderOriginTmp[i].isDisableSelect) {
              // ko xử lý sản phẩm storno
              for (let j = 0; j < this.allRetourValue.length; j++) {
                if (
                  orderLinesOrderOriginTmp[i].product_id ==
                  this.allRetourValue[j].productId
                ) {
                  orderLinesOrderOriginTmp[i].remainQuantity =
                    Number(orderLinesOrderOriginTmp[i].quantity) -
                    Number(this.allRetourValue[j].retourQuantity) -
                    Number(
                      orderLinesOrderOriginTmp[i].retourQuantity != ""
                        ? orderLinesOrderOriginTmp[i].retourQuantity
                        : 0
                    );
                  orderLinesOrderOriginTmp[i].retourQuantity =
                    Number(
                      orderLinesOrderOriginTmp[i].retourQuantity != ""
                        ? orderLinesOrderOriginTmp[i].retourQuantity
                        : 0
                    ) + Number(this.allRetourValue[j].retourQuantity);
                }
              }
            }
          }
          this.orderOrigin.orderLines = orderLinesOrderOriginTmp;
          this.orderOrigin.retourState = "products";
        } else {
          isValidToGo = false;
          this.$store.dispatch("popup/updatePopupState", true);
          this.$store.dispatch(
            "order/showHidePopupAlertEnterRetourInput",
            true
          );
        }
      } else {
        // retour toàn bộ đơn hàng
        let orderLinesNewOrderTmp = globalFunction.deepCloneObj(
          this.orderForShow.orderlines
        );
        let orderLinesOrderOriginTmp = globalFunction.deepCloneObj(
          JSON.parse(this.order.orderlines)
        );
        let orderDiscountValue = 0;
        let itemDiscountValue = 0;
        let totalQuantityProducts = 0;

        orderDiscountValue = this.orderForShow.orderData.orderDiscountValue;
        for (let i = 0; i < orderLinesNewOrderTmp.length; i++) {
          totalQuantityProducts += orderLinesNewOrderTmp[i].quantity;
        }
        itemDiscountValue =
          Number(orderDiscountValue) / Number(totalQuantityProducts);

        for (let i = 0; i < orderLinesNewOrderTmp.length; i++) {
          orderLinesNewOrderTmp[i].price =
            Number(orderLinesNewOrderTmp[i].price) * -1;
          orderLinesNewOrderTmp[i].priceAfterChange =
            Number(orderLinesNewOrderTmp[i].priceAfterChange) * -1;
          orderLinesNewOrderTmp[i].priceOrigin =
            Number(orderLinesNewOrderTmp[i].priceOrigin) * -1;
          orderLinesNewOrderTmp[i].quantity =
            Number(orderLinesNewOrderTmp[i].remainQuantity) * -1;
          orderLinesNewOrderTmp[i].retourQuantity =
            Number(orderLinesNewOrderTmp[i].remainQuantity) +
            Number(orderLinesNewOrderTmp[i].retourQuantity);
          orderLinesNewOrderTmp[i].remainQuantity = 0;

          if (orderLinesNewOrderTmp[i].isDiscount) {
            orderLinesNewOrderTmp[i].discount =
              Number(orderLinesNewOrderTmp[i].discount) * -1;
          }
        }
        totalQuantityProducts = 0;
        for (let i = orderLinesNewOrderTmp.length; i--; ) {
          if (Number(orderLinesNewOrderTmp[i].quantity) == -0) {
            orderLinesNewOrderTmp.splice(i, 1);
            continue;
          }
          totalQuantityProducts += Number(orderLinesNewOrderTmp[i].quantity);
        }
        if (orderLinesNewOrderTmp.length == 0) {
          isValidToGo = false;
          this.$store.dispatch("popup/updatePopupState", true);
          this.$store.dispatch("order/showHidePopupNoProductRetour", true);
        }

        orderDiscountValue =
          Number(itemDiscountValue) * Number(totalQuantityProducts) * -1;
        this.newOrder.orderDiscountValue = orderDiscountValue;
        this.newOrder.orderDiscount = orderDiscountValue;
        this.newOrder.total_discount = orderDiscountValue;
        this.newOrder.orderLines = orderLinesNewOrderTmp;
        this.newOrder.orderIncluded = orderLinesNewOrderTmp;
        this.newOrder.retourState = "all";

        for (let i = 0; i < orderLinesOrderOriginTmp.length; i++) {
          if (!orderLinesOrderOriginTmp[i].isDisableSelect) {
            // ko xử lý sản phẩm storno
            orderLinesOrderOriginTmp[i].retourQuantity =
              orderLinesOrderOriginTmp[i].quantity;
            orderLinesOrderOriginTmp[i].remainQuantity = 0;
          }
        }
        this.orderOrigin.orderLines = orderLinesOrderOriginTmp;
        this.orderOrigin.retourState = "all";
      }

      if (isValidToGo) {
        this.$store.commit("listOrder/setRetourReason", "");
        this.$store.commit("listOrder/setActionRetour", false);
        this.$store.dispatch("popup/updatePopupState", true);
        this.$store.dispatch("order/showHidePopupReasonRetour", true);
      }
    },

    setRetourOrder() {
      let ordersTmp = globalFunction.deepCloneObj(this.orders);

      for (let i = 0; i < ordersTmp.length; i++) {
        ordersTmp[i].isActive = false;
      }

      this.newOrder.retourReason = this.retourReason;
      ordersTmp.push(this.newOrder);
      this.$store.commit("order/setOrderSelected", this.newOrder);
      this.$store.commit("order/setOrders", ordersTmp);
      this.$store.dispatch("order/calculateOrder");

      // thực hiện lưu order và chuyển đến page print để tính toán
      this.$store.commit("helper/showLoading", true);
      OrderService.addOrder(this.orderOrigin).then(() => {
        // update lại order gốc
        OrderService.addOrder(this.orderSelected).then((orderResp) => {
          // lưu mới order retour
          this.$store.commit("order/setBelegOrder", orderResp.beleg);

          OrderService.save().then(() => {
            this.$store.commit("helper/showLoading", false);
            this.$router.push({ path: "/print", query: { type: "retour" } });
          });
        });
      });
    },

    // method bàn phím ảo
    showHideNumberKeyboard(e, value) {
      if (!this.$device.android && !this.$device.ios) {
        this.$store.dispatch("helper/updateKeyboardState", value);
        this.$store.dispatch("helper/showHideNumberKeyboard", value);
        this.$store.commit("helper/setStateOpenKeyboardRetour", true);

        this.inputSelected = `#${e.target.id}`;
        this.inputNameSelected = e.target.id;

        setTimeout(() => {
          this.$refs.keyboard.setInputName();
          this.$refs.keyboard.handleHeightCloseButton();

          // clear input value
          this.$refs.keyboard.clearInput();
          document.querySelector(this.inputSelected).value = "";
        }, 0);
      }
    },

    onChangeKeyboard(input) {
      this.input = input;
      document.querySelector(this.inputSelected).value = input;

      let idTemp = document
        .querySelector(this.inputSelected)
        .getAttribute("data-input-productid");
      this.validateValueInputRetour(idTemp);
    },

    onInputChange(e) {
      // tracking các input change được tạo ra không phải từ bàn phím ảo
      this.input = e.target.value;
      this.inputValueSelected = e.target.value;

      setTimeout(() => {
        let idTemp = document
          .querySelector(this.inputSelected)
          .getAttribute("data-input-productid");

        this.$refs.keyboard.setInputValue();
        this.validateValueInputRetour(idTemp);
      }, 0);
    },
  },

  created() {
    this.orderRefId = this.$route.params.id;
    this.$store.dispatch("helper/hideAllKeyboard");
    this.$store.commit("listOrder/setRetourReason", "");
    this.$store.commit("listOrder/setActionRetour", false);

    this.getData();
  },

  mounted() {},
};
</script>
