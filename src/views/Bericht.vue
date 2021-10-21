<template>
  <div class="body-wrapper">
    <main>
      <div class="bericht-header">
        <div class="bericht-header-button">
          <button
            type="button"
            @click="changeBerichtType('tages')"
            :class="{ 'is-active': this.berichtType === 'tages' }"
          >
            Tages Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('tagessession')"
            :class="{ 'is-active': this.berichtType === 'tagessession' }"
          >
            Tages Session Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('monat')"
            :class="{ 'is-active': this.berichtType === 'monat' }"
          >
            Monat Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('monatuser')"
            :class="{ 'is-active': this.berichtType === 'monatuser' }"
          >
            Monat User Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('jahr')"
            :class="{ 'is-active': this.berichtType === 'jahr' }"
          >
            Jahres Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('jahresuser')"
            :class="{ 'is-active': this.berichtType === 'jahresuser' }"
          >
            Jahres User Bericht
          </button>
          <button
            type="button"
            @click="changeBerichtType('opensession')"
            :class="{ 'is-active': this.berichtType === 'opensession' }"
          >
            Open Session
          </button>
          <button type="button" @click="goToVerkauflist()">Verkauflist</button>
          <button type="button" @click="goToTable()">Setting table</button>
        </div>
        <!-- <div class="bericht-info-header">
          <datepicker v-model="selectedDate" :format="formatDate" v-if="berichtType === 'tagessession'" class="datepicker-common">
          </datepicker>
          <select class="select-common" v-model="selectedMonth" v-if="berichtType === 'monat' || berichtType === 'monatuser'">
            <option v-for="(month, index) in months" :value="month" :key="index">{{month}}</option>
          </select>
          <select class="select-common" v-model="selectedYear" v-if="berichtType === 'jahr' || berichtType === 'jahresuser'">
            <option v-for="(year, index) in years" :value="year" :key="index">{{year}}</option>
          </select>
          <select class="select-common" v-model="selectedSession" v-if="berichtType === 'tagessession'">
            <option v-for="(session, index) in sessions" :value="session.id" :key="index">{{session.name}}</option>
          </select>
          <select class="select-common" v-model="selectedUser" v-if="berichtType === 'monatuser' || berichtType === 'jahresuser'">
            <option v-for="(user, index) in posusers" :value="user" :key="index">{{user.login}}-{{user.name}}</option>
          </select>
        </div> -->
      </div>
      <div class="bericht-page">
        <div class="bill-details-box">
          <div class="bill-layout-wrapper" ref="billLayoutWrapper">
            <div
              class="bill-layout bill-layout-type2"
              v-if="berichtType === 'opensession'"
            >
              <div class="bill-header">
                <div class="bill-single-item">
                  <div class="bill-row">
                    <div class="bill-col bill-col-product">
                      Kasse
                    </div>
                    <div class="bill-col bill-col-total-amount">
                      Begin zeit:
                    </div>
                  </div>
                </div>
                <div class="bill-single-item"><br /></div>
                <div class="bill-single-item">
                  <div class="bill-row">
                    <div class="bill-col bill-col-product">
                      Kasse 1
                    </div>
                    <div class="bill-col bill-col-total-amount">
                      2019-11-01 20:05:07
                    </div>
                  </div>
                  <div class="bill-row">
                    <div class="bill-col bill-col-product">
                      Kasse 2
                    </div>
                    <div class="bill-col bill-col-total-amount">
                      2019-11-01 20:05:10
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- phần giao diện cho in hóa đơn -->
            <div
              class="bill-layout bill-layout-type2 bill-fix-height"
              v-if="berichtType != 'opensession'"
            >
              <div class="bill-header">
                <h1>ASIA24 GmbH111</h1>
                <p>Herzbergstr. 128-139</p>
                <p>10365 Berlin</p>
                <p>Tel.: 030-55 49 17 53</p>
                <p>Fax.: 030-55 49 18 79</p>
                <p>Steuer Nr: 37/212/32595</p>
                <p>------------------------</p>
              </div>
              <div class="bill-datetime">
                <p>Bericht Nr: 16</p>
                <p>Von : 04.12.2019 15:48:19</p>
                <p>Zum : 04.12.2019 15:48:19</p>
              </div>

              <div class="bill-row bill-row-heading">
                <p>___Übersicht_____________________</p>
              </div>
              <div class="bill-single-item"></div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Anzahl - Waren Mwst. 7%
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Summe - Waren Mwst. 7%
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Anzahl - Waren Mwst. 19%
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Summe - Waren Mwst. 19%
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Vorgange "Stornos"
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Anzahl Kunden
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row bill-row-summe">
                  <div class="bill-col bill-col-product">
                    <b>Summe</b>
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    <b>0€</b>
                  </div>
                </div>
              </div>
              <div class="bill-row bill-row-heading">
                <p>___Steuer_______________________</p>
              </div>
              <div class="bill-row bill-row-summe">
                <div
                  class="bill-col bill-col-sperate"
                  style="font-weight:bold;"
                >
                  BAREINNAHMEN in €
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row bill-row-full">
                  <div class="bill-col bill-col-product">
                    Mwst 7% (0€) aus 0€
                  </div>
                  <div
                    class="bill-col bill-col-total-amount"
                    style="text-align: right; font-weight: bold; margin: 5px 0;"
                  >
                    =0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row bill-row-full">
                  <div class="bill-col bill-col-product">
                    Mwst 19% (0€) aus 0€
                  </div>
                  <div
                    class="bill-col bill-col-total-amount"
                    style="text-align: right; font-weight: bold; margin: 5px 0;"
                  >
                    =0€
                  </div>
                </div>
              </div>
              <div class="bill-row">
                <div class="bill-col bill-col-product">
                  Rabatt
                </div>
                <div class="bill-col bill-col-total-amount">
                  0€
                </div>
              </div>
              <div class="bill-row">
                <div class="bill-col bill-col-product">
                  Anzahl
                </div>
                <div class="bill-col bill-col-total-amount">
                  0
                </div>
              </div>
              <div class="bill-row bill-row-summe" style="font-weight:bold;">
                <div class="bill-col bill-col-product">
                  Summe
                </div>
                <div class="bill-col bill-col-total-amount">
                  0
                </div>
              </div>
              <div class="bill-row bill-row-summe">
                <div
                  class="bill-col bill-col-sperate"
                  style="font-weight:bold;"
                >
                  KREDITZAHLUNGEN in €
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row bill-row-full">
                  <div class="bill-col bill-col-product">
                    Mwst 7% (0€) aus 0€
                  </div>
                  <div
                    class="bill-col bill-col-total-amount"
                    style="text-align: right; font-weight: bold; margin: 5px 0;"
                  >
                    =0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row bill-row-full">
                  <div class="bill-col bill-col-product">
                    Mwst 19% (0€) aus 0€
                  </div>
                  <div
                    class="bill-col bill-col-total-amount"
                    style="text-align: right; font-weight: bold; margin: 5px 0;"
                  >
                    =0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Rabatt
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Anzahl
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0
                  </div>
                </div>
              </div>
              <div class="bill-row bill-row-summe" style="font-weight:bold;">
                <div class="bill-col bill-col-product">
                  Summe
                </div>
                <div class="bill-col bill-col-total-amount">
                  0
                </div>
              </div>
              <div class="bill-row bill-row-heading">
                <p>_____Summen___________________</p>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Summe Mwst
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item">
                <div class="bill-row">
                  <div class="bill-col bill-col-product">
                    Summe Netto
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-single-item" style="font-weight:bold;">
                <div class="bill-row bill-row-summe">
                  <div class="bill-col bill-col-product">
                    Summe Brutto
                  </div>
                  <div class="bill-col bill-col-total-amount">
                    0€
                  </div>
                </div>
              </div>
              <div class="bill-row bill-row-heading">
                <p>________________________________</p>
              </div>
              <div class="bill-datetime">
                <p>Gedruckt am: 04.12.2019 15:48:21</p>
              </div>
            </div>
          </div>
        </div>
        <div class="print-box" ref="printBox">
          <div class="btn-print do-print" @click="doPrint()">
            <span class="icon-print-box icon-printer"></span>
            <span class="text-box">
              In
            </span>
          </div>
          <div
            class="btn-print do-download"
            v-if="berichtType === 'tagessession'"
          >
            <span class="icon-print-box icon-download"></span>
            <span class="text-box">
              Excel
            </span>
          </div>
          <div
            class="btn-print do-download"
            v-if="berichtType === 'tagessession'"
          >
            <span class="icon-print-box icon-download"></span>
            <span class="text-box">
              Excel Gesamt
            </span>
          </div>
          <div class="btn-print do-download" v-if="berichtType === 'monat'">
            <span class="icon-print-box icon-download"></span>
            <span class="text-box">
              Excel
            </span>
          </div>
          <div class="btn-print do-download" v-if="berichtType === 'monatuser'">
            <span class="icon-print-box icon-download"></span>
            <span class="text-box">
              Excel
            </span>
          </div>
          <div class="btn-print do-next" @click="logout()">
            <span class="icon-print-box icon-logout-2"></span>
            <span class="text-box">
              Schließen
            </span>
          </div>
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
    return {
      berichtType: "tagessession",
    };
  },

  computed: {},

  components: {},

  methods: {
    changeBerichtType(type) {
      this.berichtType = type;
    },

    goToVerkauflist() {
      this.$router.push({ path: "list-orderedchef" });
    },

    goToTable() {
      this.$router.push({ path: "/table" });
    },

    doPrint() {
      window.print();
    },

    logout() {
      this.$router.push({ path: "/" });
    },

    handleHeightBillLayout() {
      let billLayoutWrapper = this.$refs.billLayoutWrapper;
      let offsettopBillLayout = billLayoutWrapper.getBoundingClientRect().top;
      let windowHeight = window.innerHeight;
      let hBlockFooter = this.$refs.printBox.getBoundingClientRect().height;
      let heightBillLayout = windowHeight - offsettopBillLayout - hBlockFooter;

      billLayoutWrapper.style.height = `${heightBillLayout}px`;
    },
  },

  created() {},

  mounted() {
    this.handleHeightBillLayout();
  },
};
</script>
