<template>
  <div class="single-print-component" v-if="isComponentReady">
    <div
      class="print-details-box"
      :class="{ 'on-smallscreen': isOnSmallScreen }"
    >
      <div class="bill-details-wrapper">
        <div class="bill-details-header" ref="billDetailsHeader">
          <div class="row-header">
            <div class="row-info">
              <div class="col-info">Name</div>
              <div class="col-info">Amount</div>
              <div class="col-info">Total</div>
              <div class="col-info">Discount</div>
            </div>
          </div>
          <div class="row-body" ref="rowBody">
            <div
              class="row-info"
              v-for="orderLine in orderInfo.orderLines"
              :key="orderLine.ref"
              :class="[
                orderLine.isDisableSelect ? 'is-disable' : '',
                orderLine.isOverDiscount ? 'is-over-discount' : '',
                orderLine.isTogo ? 'is-togo' : '',
              ]"
              ref="rowData"
            >
              <div class="col-info">
                {{ orderLine.name }}
              </div>
              <div class="col-info">
                {{ orderLine.quantity }}
              </div>
              <div class="col-info">{{ orderLine.totalAmount }} €</div>
              <div class="col-info">
                {{ orderLine.discount }} {{ orderLine.discountType || "€" }}
              </div>
            </div>
          </div>
        </div>
        <div class="bill-details-body" ref="billDetailsBody">
          <div class="row-bill-details gesamt-box">
            <span class="gesamt-title">Gesamt: </span>
            <span class="gesamt-num">{{ orderInfo.moneyToPay }}€</span>
          </div>
          <div class="row-bill-details netto-box">
            <span class="netto-title">Netto: </span>
            <span class="netto-num">{{ orderInfo.netto }}€</span>
          </div>
          <div class="row-bill-details total-discount-box">
            <span class="total-discount-title">Total Discount: </span>
            <span class="total-discount-num"
              >{{ orderInfo.totalDiscount }}€</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- phần giao diện in hóa đơn -->
    <div class="bill-layout-wrapper not-bericht-page">
      <div class="bill-layout bill-fontsize-16">
        <div class="bill-header">
          <h1>
            {{ company.firmenname }}
          </h1>
          <p>
            {{ company.strabe_hausnummer }}
          </p>
          <p>
            {{ company.plz_stadt }}
          </p>
          <p>Tel.: {{ company.tel }}</p>
          <p>Fax.: {{ company.fax }}</p>
          <p>Steuer Nr: {{ company.steuernr }}</p>
          <p>------------------------</p>
        </div>
        <div class="bill-datetime">
          <p>
            Von:
            {{ $moment(orderInfo.startTime).format("DD.MM.YYYY HH:mm:ss") }}
          </p>
          <p>Beleg: {{ this.belegOrder }}</p>
          <p v-if="queryUrl == 'retour'">
            Retoure Grund: {{ orderInfo.retourReason }}
          </p>
          <p v-if="queryUrl == 'retour'">
            Retoure von Beleg: {{ orderInfo.retourFromBeleg }}
          </p>
          <p v-if="queryUrl == '' && orderInfo.reasonStornoAll != ''">
            Storno Grund: {{ orderInfo.reasonStornoAll }}
          </p>
        </div>
        <div class="bill-user" style="text-align: left; font-size: 15px;">
          {{ user.fullname }}
        </div>
        <div class="bill-row bill-row-heading">
          <div class="bill-col bill-col-heading">
            Artikel
          </div>
          <div class="bill-col bill-col-heading">
            Betrag €
          </div>
        </div>
        <div
          class="bill-single-item"
          v-for="orderLine in orderInfo.orderLines"
          :key="orderLine.ref"
        >
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              {{ orderLine.print_name }}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              <small>({{ orderLine.uom_code }})</small>
              {{ orderLine.quantity }} X {{ orderLine.price }} €
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderLine.totalAmount }} €
              <span v-if="orderLine.mwst == 7"> A</span>
              <span v-if="orderLine.mwst == 19"> B</span>
            </div>
          </div>
          <div class="bill-col bill-col-rabatt" v-if="orderLine.discount !== 0">
            <i style="font-size: 14px;">Mit {{ orderLine.discount }}€ Rabatt</i>
          </div>
        </div>
        <div class="bill-zwis">
          <div class="bill-row">
            <div class="bill-col bill-col-sperate">---------------</div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Zwischensumme:
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.totalPrice }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-sperate">---------------</div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Produktrabatt:
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.totalDiscountOrderLines }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Gesamtrabatt:
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.totalDiscountOrderInPayment }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-sperate">---------------</div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-brutto">
              <strong>
                Summe(Brutto):
              </strong>
            </div>
            <div class="bill-col bill-col-brutto">
              <strong> {{ orderInfo.moneyToPay }} € </strong>
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Mwst 7% (A)
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.totalMwst7 }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Mwst 19% (B)
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.totalMwst19 }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Summe(Netto):
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.netto }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-sperate">=============</div>
          </div>
        </div>
        <div class="bill-row-footer">
          <div class="bill-row bill-row-barzah">
            <div class="bill-col bill-col-product">
              <span>Barzahlung (EUR):</span>
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.moneyGiven }} €
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Rückgeld:
            </div>
            <div class="bill-col bill-col-total-amount">
              {{ orderInfo.moneyChange }} €
            </div>
          </div>
          <div class="bill-row bill-row-footer-star">
            <span>
              *
            </span>
            <span>
              *
            </span>
            <span>
              *
            </span>
            <span>
              *
            </span>
            <span>
              *
            </span>
          </div>
          <h3 class="spacing-bottom-print" v-if="queryUrl == ''">
            Vielen dank und besuchen Sie uns wieder.
          </h3>
          <div class="confirm-text" v-if="queryUrl == 'retour'">
            <div class="confirm-line">
              Name ____________________________________
            </div>
            <div class="confirm-line">
              Anschrift ________________________________
            </div>
            <div class="confirm-line">
              Unterschrift
            </div>
            <div class="confirm-line">
              __________________________________________
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
import OrdersDataService from "@/mixins/OrdersDataService";
import OrderService from "@/services/OrderService.js";

export default {
  mixins: [OrdersDataService],

  components: {},

  data() {
    return {
      queryUrl: "",
      isComponentReady: false,
    };
  },

  computed: {
    ...mapState({
      orders: (state) => state.order.orders,
      orderSelected: (state) => state.order.orderSelected,
      tableOrdered: (state) => state.table.tableOrdered,
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      user: (state) => state.user.user,
      company: (state) => state.company.company,
      isGetOrdersFinished: (state) => state.helper.isGetOrdersFinished,
      belegOrder: (state) => state.order.belegOrder,
    }),

    orderInfo() {
      if (globalFunction.checkValid(this.orderSelected.orderLines)) {
        let orderLinesTmp = this.orderSelected.orderLines;

        if (!globalFunction.checkValid(this.orderSelected.moneyToPay)) {
          this.orderSelected.moneyToPay = this.orderSelected.totalPrice;
        }

        for (let orderLine of orderLinesTmp) {
          orderLine.discount = Number(orderLine.discount).toFixed(2);
        }

        return {
          orderLines: orderLinesTmp,
          moneyToPay: Number(this.orderSelected.moneyToPay).toFixed(2),
          netto: Number(this.orderSelected.netto).toFixed(2),
          totalPrice: Number(this.orderSelected.totalPrice).toFixed(2),
          totalDiscountOrderLines: Number(
            this.orderSelected.productDiscount
          ).toFixed(2),
          totalDiscountOrderInPayment: Number(
            this.orderSelected.orderDiscount
          ).toFixed(2),
          totalDiscount: Number(this.orderSelected.total_discount).toFixed(2),
          moneyGiven: Number(this.orderSelected.moneyGiven).toFixed(2),
          moneyChange: Number(this.orderSelected.moneyChange).toFixed(2),
          startTime: this.orderSelected.startTime,
          totalMwst19: Number(this.orderSelected.totalMwst19).toFixed(2),
          totalMwst7: Number(this.orderSelected.totalMwst7).toFixed(2),
          retourReason: this.orderSelected.retourReason,
          retourFromBeleg: this.orderSelected.retourFromBeleg,
          reasonStornoAll: this.orderSelected.reasonStornoAll,
        };
      }
    },
  },

  watch: {
    isGetOrdersFinished() {
      if (this.isGetOrdersFinished) {
        this.handleOrdersInfo();
        this.getBelegNumber();
      }
    },
  },

  methods: {
    detectQueryUrl() {
      this.queryUrl = this.$route.query.type;
      if (typeof this.queryUrl == "undefined") {
        this.queryUrl = "";
      }
    },

    handleOrdersInfo() {
      this.isComponentReady = false;
      for (let order of this.orders) {
        if (order.isActive) {
          this.$store.commit("order/setOrderSelected", order);
        }
      }
      this.isComponentReady = true;

      this.$store.dispatch("order/handleTaxOrder");
      this.$nextTick(() => {
        if (this.isComponentReady) {
          let hBlockFooter =
            this.$refs.billDetailsBody.getBoundingClientRect().height +
            document.querySelector(".print-box").getBoundingClientRect().height;
          globalFunction.handleHeightListBox(
            this.$refs.billDetailsHeader,
            this.$refs.rowBody,
            this.$refs.rowData,
            this.orderSelected.orderLines.length - 1,
            hBlockFooter,
            "medium"
          );
        }
      });
    },

    async getBelegNumber() {
      if (this.belegOrder == "") {
        this.$store.commit("helper/showLoading", true);

        OrderService.addOrder(this.orderSelected).then((orderResp) => {
          this.$store.commit("order/setBelegOrder", orderResp.beleg);

          this.$store.commit("helper/showLoading", false);
        });
      }
    },
  },

  created() {
    this.detectQueryUrl();
  },
};
</script>

<style></style>
