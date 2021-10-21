<template>
  <div class="single-print-component">
    <div class="bill-details-box">
      <div class="bill-layout-wrapper" ref="billLayoutWrapper">
        <div class="bill-layout">
          <div class="bill-row">
            <div class="bill-col bill-col-product" style="font-weight: bold; font-size: 19px">
              Sesssion
            </div>
            <div class="bill-col bill-col-total-amount" style="font-weight: bold; font-size: 19px">
              {{sessionDataForShow.name}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Session Begin
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.beginTime}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Zur zeit:
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.currentTime}}
            </div>
          </div>
          <br>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              ___Übersicht____________________________
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Anzahl - Waren Mwst. 7%
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.anzahlmwst7}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Summe - Waren Mwst. 7%
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.total7}}€
            </div>
          </div>
          <br>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Anzahl - Waren Mwst. 19%
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.anzahlmwst19}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Summe - Waren Mwst. 19%
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.total19}}€
            </div>
          </div>
          <br>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Anzahl Kunden
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.kundenanzahl}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Vorgänge Stornos
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.anzahlstorno}}
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Summe Stornos
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.summestorno}}€
            </div>
          </div>
          <br>
          <div class="bill-row bill-row-summe" style="font-weight:bold;">
            <div class="bill-col bill-col-product" style="font-size: 19px;">
              Summe
            </div>
            <div class="bill-col bill-col-total-amount" style="font-size: 19px;">
              {{sessionDataForShow.totalpricewithoutdiscount}}€
            </div>
          </div>
          <br>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              ___Steuer_______________________________
            </div>
          </div>
          <div class="bill-row bill-row-summe">
            <div class="bill-col bill-col-product">
              BAREINNAHMEN
            </div>
          </div>
          <div class="bill-row bill-row-full">
            <div class="bill-col bill-col-product">
              Mwst 7% ({{sessionDataForShow.barmwst7}}) aus {{sessionDataForShow.ausBarmwst7}}€
            </div>
            <div class="bill-col bill-col-total-amount" style="text-align: right; font-weight: bold; margin: 5px 0;">
              ={{sessionDataForShow.bartotal7}}€
            </div>
          </div>
          <div class="bill-row bill-row-full">
            <div class="bill-col bill-col-product">
              Mwst 19% ({{sessionDataForShow.barmwst19}}) aus {{sessionDataForShow.ausBarmwst19}}€
            </div>
            <div class="bill-col bill-col-total-amount" style="text-align: right; font-weight: bold; margin: 5px 0;">
              ={{sessionDataForShow.bartotal19}}€
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Rabatt
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.barTotalDiscountInAmount}}€
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Anzahl
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.anzahlbar}}
            </div>
          </div>
          <div class="bill-row" style="font-weight:bold;">
            <div class="bill-col bill-col-product"> </div>
            <div class="bill-col bill-col-total-amount">
              Brutto = {{sessionDataForShow.barTotal}}€
            </div>
          </div>
          <br/>
          <div class="bill-row bill-row-summe">
            <div class="bill-col bill-col-product">
              KREDITZAHLUNGEN
            </div>
          </div>
          <div class="bill-row bill-row-full">
            <div class="bill-col bill-col-product">
              Mwst 7% ({{sessionDataForShow.creditmwst7}}€) aus {{sessionDataForShow.ausCreditmwst7}}€
            </div>
            <div class="bill-col bill-col-total-amount" style="text-align: right; font-weight: bold; margin: 5px 0;">
              ={{sessionDataForShow.credittotal7}}€
            </div>
          </div>
          <div class="bill-row bill-row-full">
            <div class="bill-col bill-col-product">
              Mwst 19% ({{sessionDataForShow.creditmwst19}}€) aus {{sessionDataForShow.ausCreditmwst19}}€
            </div>
            <div class="bill-col bill-col-total-amount" style="text-align: right; font-weight: bold; margin: 5px 0;">
              ={{sessionDataForShow.credittotal19}}€
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Rabatt
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.creditTotalDiscountInAmount}}€
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              Anzahl
            </div>
            <div class="bill-col bill-col-total-amount">
              {{sessionDataForShow.anzahlcredit}}
            </div>
          </div>
          <div class="bill-row" style="font-weight:bold;">
            <div class="bill-col bill-col-product"> </div>
            <div class="bill-col bill-col-total-amount">
              Brutto = {{sessionDataForShow.creditTotal}}€
            </div>
          </div>
          <div class="bill-row">
            <div class="bill-col bill-col-product">
              ___Summen_____________________________
            </div>
          </div>
          <div class="bill-row" style="font-weight:bold;">
            <div class="bill-col bill-col-product" style="font-size: 15px;">
              Summe Mwst
            </div>
            <div class="bill-col bill-col-total-amount" style="font-size: 15px;">
              {{sessionDataForShow.sumMwst}}€
            </div>
          </div>
          <div class="bill-row" style="font-weight:bold;">
            <div class="bill-col bill-col-product" style="font-size: 15px;">
              Summe Netto
            </div>
            <div class="bill-col bill-col-total-amount" style="font-size: 15px;">
              {{sessionDataForShow.sumNetto}}€
            </div>
          </div>
          <br>
          <div class="bill-row bill-row-summe" style="font-weight:bold;">
            <div class="bill-col bill-col-product" style="font-size: 19px;">
              Summe Brutto
            </div>
            <div class="bill-col bill-col-total-amount" style="font-size: 19px;">
              {{sessionDataForShow.sumBrutto}}€
            </div>
          </div>
          <div style="height: 100px; position: relative;">
            <span style="position: absolute; left: 0; bottom: 0; color: white;">
              Placeholder
            </span>
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
      return {};
    },

    components: {},

    computed: {
      ...mapState({
        isOnSmallScreen: state => state.helper.isOnSmallScreen,
        user: state => state.user.user,
        sessionUser: state => state.sessionUser.sessionUser,
        sessionOrder: state => state.sessionOrder.sessionOrder,
      }),

      sessionDataForShow() {
        return {
          name: this.sessionUser.name,
          beginTime: this.$moment(this.sessionUser.begintime).format('DD.MM.YYYY HH:mm:ss'),
          currentTime: this.$moment(new Date()).format('DD.MM.YYYY HH:mm:ss'),
          anzahlmwst7: this.sessionOrder.anzahlmwst7 || 0,
          total7: parseFloat(this.sessionOrder.total7 || 0).toFixed(2),
          anzahlmwst19: this.sessionOrder.anzahlmwst19 || 0,
          total19: parseFloat(this.sessionOrder.total19 || 0).toFixed(2),
          kundenanzahl: this.sessionOrder.kundenanzahl,
          anzahlstorno: this.sessionOrder.anzahlstorno,
          summestorno: parseFloat(this.sessionOrder.summestorno || 0).toFixed(2),
          totalpricewithoutdiscount: parseFloat(this.sessionOrder.totalpricewithoutdiscount || 0).toFixed(2),
          barmwst7: parseFloat(this.sessionOrder.barmwst7 || 0).toFixed(2),
          bartotal7: parseFloat(this.sessionOrder.bartotal7 || 0).toFixed(2),
          ausBarmwst7: (parseFloat(this.sessionOrder.bartotal7 || 0) - parseFloat(this.sessionOrder.barmwst7 || 0)).toFixed(2),
          barmwst19: parseFloat(this.sessionOrder.barmwst19 || 0).toFixed(2),
          bartotal19: parseFloat(this.sessionOrder.bartotal19 || 0).toFixed(2),
          ausBarmwst19: (parseFloat(this.sessionOrder.bartotal19 || 0) - parseFloat(this.sessionOrder.barmwst19 || 0)).toFixed(2),
          anzahlbar: this.sessionOrder.anzahlbar,
          barTotalDiscountInAmount: parseFloat(this.sessionOrder.bar_total_discount_in_amount || 0).toFixed(2),
          barTotal: (parseFloat(this.sessionOrder.bartotal7 || 0) + parseFloat(this.sessionOrder.bartotal19 || 0)).toFixed(2),
          creditmwst7: parseFloat(this.sessionOrder.creditmwst7 || 0).toFixed(2),
          credittotal7: parseFloat(this.sessionOrder.credittotal7 || 0).toFixed(2),
          ausCreditmwst7: (parseFloat(this.sessionOrder.credittotal7 || 0) - parseFloat(this.sessionOrder.creditmwst7 || 0)).toFixed(2),
          creditmwst19: parseFloat(this.sessionOrder.creditmwst19 || 0).toFixed(2),
          credittotal19: parseFloat(this.sessionOrder.credittotal19 || 0).toFixed(2),
          ausCreditmwst19: (parseFloat(this.sessionOrder.credittotal19 || 0) - parseFloat(this.sessionOrder.creditmwst19 || 0)).toFixed(2),
          creditTotalDiscountInAmount: parseFloat(this.sessionOrder.credit_total_discount_in_amount || 0).toFixed(2),
          anzahlcredit: this.sessionOrder.anzahlcredit,
          creditTotal: (parseFloat(this.sessionOrder.credittotal7 || 0) + parseFloat(this.sessionOrder.credittotal19 || 0)).toFixed(2),
          sumMwst: parseFloat(this.sessionOrder.mwst || 0).toFixed(2),
          sumNetto: parseFloat(this.sessionOrder.netto || 0).toFixed(2),
          sumBrutto: parseFloat(this.sessionOrder.total_with_discount || 0).toFixed(2)
        }
      }
    },

    methods: {
      async getUserSession() {
        this.$store.commit('helper/showLoading', true);

        let userName = this.user.username;
        let url = globalFunction.baseUrl + 'session/get_by_user';
        let postBody = {
          'username': userName
        }
        let sessionData = await globalFunction.request(url, postBody);

        sessionData = JSON.parse(sessionData.data)[0];
        this.$store.commit('sessionUser/setSessionUserData', sessionData);
        console.log('sessionData:', sessionData);

        let urlSessionOrder = globalFunction.baseUrl + 'bericht/sessionorder';
        let postBodySession = {
          'session': sessionData.code
        };
        let sessionOrderResponse = await globalFunction.request(urlSessionOrder, postBodySession);
        this.$store.commit('sessionOrder/setSessionOrderData', sessionOrderResponse);
        console.log('sessionOrderResponse:', sessionOrderResponse);
        
        this.$store.commit('helper/showLoading', false);
        this.handleHeightBillLayout();
      },

      handleHeightBillLayout() {
        let billLayoutWrapper = this.$refs.billLayoutWrapper;
        let offsettopBillLayout = billLayoutWrapper.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        let hBlockFooter = document.querySelector(".print-box").getBoundingClientRect().height;
        let heightBillLayout = windowHeight - offsettopBillLayout - hBlockFooter;

        billLayoutWrapper.style.height = `${heightBillLayout}px`;
      },
    },

    created() {
      this.getUserSession();
    },

    mounted() {
    },
  };
</script>

<style>

</style>
