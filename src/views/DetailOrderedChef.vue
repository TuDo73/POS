<template>
  <div class="body-wrapper">
    <main>
      <!-- phần giao diện in hóa đơn -->
      <!-- <div class="bill-layout-wrapper" ref="billLayoutWrapper">
				<div class="bill-layout bill-fontsize-16">
					<div class="bill-header">
						<h1>* * * COPY * * *</h1>
						<h1>
							{{company.firmenname}}
						</h1>
						<p>
							{{company.strabe_hausnummer}}
						</p>
						<p>
							{{company.plz_stadt}}
						</p>
						<p>Tel.: {{company.tel}}</p>
						<p>Fax.: {{company.fax}}</p>
						<p>Steuer Nr: {{company.steuernr}}</p>
						<p>------------------------</p>
					</div>
					<div class="bill-datetime">
						<p>Von: {{$moment(orderInfo.startTime).format("DD.MM.YYYY HH:mm:ss")}}</p>
						<p>Beleg: {{this.belegOrder}}</p>
						<p v-if="queryUrl == 'retour'">Retoure Grund: {{orderInfo.retourReason}}</p>
						<p v-if="queryUrl == 'retour'">Retoure von Beleg: {{orderInfo.retourFromBeleg}}</p>
						<p v-if="queryUrl == '' && orderInfo.reasonStornoAll != ''">
							Storno Grund: {{orderInfo.reasonStornoAll}}
						</p>
					</div>
					<div class="bill-user" style="text-align: left; font-size: 15px;">
						{{user.fullname}}
					</div>
					<div class="bill-row bill-row-heading">
						<div class="bill-col bill-col-heading">
							Artikel
						</div>
						<div class="bill-col bill-col-heading">
							Betrag €
						</div>
					</div>
					<div class="bill-single-item" v-for="orderLine in orderInfo.orderLines" :key="orderLine.ref">
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								{{orderLine.print_name}}
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								<small>({{orderLine.uom_code}})</small>  {{orderLine.quantity}} X {{orderLine.price}} €
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderLine.totalAmount}} €
								<span v-if="orderLine.mwst == 7"> A</span>
								<span v-if="orderLine.mwst == 19"> B</span>
							</div>
						</div>
						<div class="bill-col bill-col-rabatt" v-if="orderLine.discount !== 0">
							<i style="font-size: 14px;">Mit {{orderLine.discount}}€ Rabatt</i>
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
								{{orderInfo.totalPrice}} €
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
								{{orderInfo.totalDiscountOrderLines}} €
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								Gesamtrabatt:
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderInfo.totalDiscountOrderInPayment}} €
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
								<strong>
									{{orderInfo.moneyToPay}} €
								</strong>
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								Mwst 7% (A)
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderInfo.totalMwst7}} €
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								Mwst 19% (B)
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderInfo.totalMwst19}} €
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								Summe(Netto):
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderInfo.netto}} €
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
								{{orderInfo.moneyGiven}} €
							</div>
						</div>
						<div class="bill-row">
							<div class="bill-col bill-col-product">
								Rückgeld:
							</div>
							<div class="bill-col bill-col-total-amount">
								{{orderInfo.moneyChange}} €
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
			</div> -->

      <div class="print-box" ref="printBox">
        <div class="btn-print" @click="showChangePaymentMethodPopup()">
          <span class="icon-print-box icon-currency-dollar"></span>
          <span class="text-box">
            Wechsel
          </span>
        </div>
        <div class="btn-print">
          <span class="icon-print-box icon-printer"></span>
          <span class="text-box">
            Print
          </span>
        </div>
        <div class="btn-print">
          <span class="icon-print-box icon-printer"></span>
          <span class="text-box">
            Export PDF
          </span>
        </div>
        <div class="btn-print">
          <span class="icon-print-box icon-close-outline"></span>
          <span class="text-box">
            Back
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState({
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
    }),
  },

  methods: {
    handleHeightBillLayout() {
      let billLayoutWrapper = this.$refs.billLayoutWrapper;
      let windowHeight = window.innerHeight;
      let hBlockFooter = this.$refs.printBox.getBoundingClientRect().height;
      let heightBillLayout = windowHeight - hBlockFooter;

      billLayoutWrapper.style.height = `${heightBillLayout}px`;
    },

    showChangePaymentMethodPopup() {
      this.$store.dispatch("popup/updatePopupState", true);
      this.$store.dispatch("popup/updatePopupChangePaymentMethod", true);
    },
  },

  created() {},

  mounted() {
    this.handleHeightBillLayout();
  },
};
</script>

<style></style>
