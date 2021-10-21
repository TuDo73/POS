<template>
  <div class="body-wrapper">
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
            id="input-search-list-orderedchef"
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
        <div class="umsatz-data">
          <span>Umsatz: </span>
          <span class="umsatz-value">17.00 €</span>
        </div>
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
              <li class="col-pl">
                <div class="col-pl-data">
                  Status
                </div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  Zahlungsmethode
                </div>
              </li>
            </ul>
          </div>
          <div class="row-body" ref="rowBody">
            <ul class="row-pl">
              <li class="col-pl small-type">
                <div class="col-pl-data">
                  Kasse 1
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  10.06.2020 16:49:03
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  165001
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  17.00 €
                </div>
              </li>
              <li class="col-pl">
                <div class="col-pl-data">
                  Verkauf
                </div>
              </li>
              <li class="col-pl large-type">
                <div class="col-pl-data">
                  <span>Kartenzahlung</span>
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
    KeyboardSearchList: KeyboardSearchList,
  },

  data() {
    return {
      date: new Date(),
      formatDate: "dd-MM-yyyy",
      formatDateForApi: "YYYY-MM-DD",
      currentItemScrollTo: 0,

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
    }),
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
      this.$router.push({ path: "/bericht" });
    },

    getListOrders() {},

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
        // this.handleHeightListBox();
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
        // this.handleHeightListBox();
      }, 0);
    },

    clearInput() {
      this.input = "";
      this.$refs.keyboard.clearInput();
      document.querySelector(this.inputSelected).value = "";
      this.$store.dispatch("listOrder/searchListOrder", this.input);

      // handle height
      setTimeout(() => {
        // this.handleHeightListBox();
      }, 0);
    },
  },

  created() {
    this.$store.dispatch("helper/hideAllKeyboard");
  },

  mounted() {},
};
</script>
