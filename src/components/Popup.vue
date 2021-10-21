<template>
  <div class="popup-common" :class="{ active: isActivePopup }" @mousedown.stop>
    <div class="popup-overlay"></div>
    <div
      class="popup-content"
      :class="[
        { 'has-keyboard': isActiveKeyboard },
        { 'on-smallscreen': isOnSmallScreen },
      ]"
    >
      <!-- gắn với keyboard -->
      <div class="popup-type type-change-text" v-if="isActiveChangeTextPopup">
        <div class="popup-heading">
          <h2>Change name?</h2>
        </div>
        <div class="popup-main">
          <div class="text-input">
            <input
              type="text"
              id="input-change-text"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
            />
          </div>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="doChangeText()"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
      </div>

      <div
        class="popup-type type-discount-single-product"
        v-if="isActiveProductDiscountPopup"
      >
        <div class="popup-discount-heading">
          <h2 class="error" v-if="!isValidValueDiscount">
            Invalid discount value!
          </h2>
        </div>
        <div class="popup-discount-wrapper">
          <div class="popup-discount-left">
            <div class="popup-heading">
              <div class="popup-btn-heading">
                <div
                  class="btn-heading"
                  :class="{ 'is-active': !lineDiscountPercentage }"
                  @click="changeDiscountState('money')"
                >
                  Discount €
                </div>
                <div
                  class="btn-heading"
                  :class="{ 'is-active': lineDiscountPercentage }"
                  @click="changeDiscountState('percent')"
                >
                  Discount %
                </div>
              </div>
              <div class="row-data" v-if="!lineDiscountPercentage">
                {{ valueDiscount | centToEuroFormat }}
              </div>
              <div class="row-data type-input">
                <div class="input big-size">
                  {{ valueDiscount }}
                </div>
                <div class="data-type-expend" v-if="lineDiscountPercentage">
                  <span>%</span>
                </div>
              </div>
            </div>
            <div class="popup-main">
              <div class="popup-numpad">
                <div class="numpad">
                  <div class="number-box">
                    <ul class="number-list">
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('7')"
                        >
                          <span>7</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('8')"
                        >
                          <span>8</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('9')"
                        >
                          <span>9</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('4')"
                        >
                          <span>4</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('5')"
                        >
                          <span>5</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('6')"
                        >
                          <span>6</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('1')"
                        >
                          <span>1</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('2')"
                        >
                          <span>2</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('3')"
                        >
                          <span>3</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('00')"
                        >
                          <span>00</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('0')"
                        >
                          <span>0</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                      <li class="number-item">
                        <div
                          class="number-btn"
                          @click="clickNumBtnDiscount('clear')"
                        >
                          <span>C</span>
                          <div class="overlay-btn"></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="btn-confirm-wrap">
                <div
                  class="btn-confirm yes-confirm is-alert"
                  @click="confirmDiscount()"
                >
                  Ok
                </div>
                <div class="btn-confirm no-confirm" @click="closePopup()">
                  Close
                </div>
              </div>
            </div>
          </div>
          <div class="popup-discount-right">
            <div class="quick-discount-button" @click="quickDiscount('5')">
              <span>5%</span>
            </div>
            <div class="quick-discount-button" @click="quickDiscount('10')">
              <span>10%</span>
            </div>
            <div class="quick-discount-button" @click="quickDiscount('15')">
              <span>15%</span>
            </div>
            <div class="quick-discount-button" @click="quickDiscount('20')">
              <span>20%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- gắn với keyboard -->
      <div
        class="popup-type type-extra-orderline"
        v-if="isActiveExtraOrderline"
      >
        <div class="popup-heading">
          <div class="heading-title-with-scrollbox">
            <h2>Extra:</h2>
            <div class="extra-scroll-box">
              <div
                class="scroll-btn scroll-down"
                @click="handleScrollList('down')"
              >
                <span class="icon-arrow-outline-down"></span>
              </div>
              <div class="scroll-btn scroll-up" @click="handleScrollList('up')">
                <span class="icon-arrow-outline-up"></span>
              </div>
            </div>
          </div>
          <div class="extra-input">
            <input
              type="text"
              id="input-extra"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
            />
          </div>
        </div>
        <div class="popup-main">
          <div class="selection-box">
            <div class="normal-option">
              <ul class="option-list" ref="extraList">
                <li
                  class="option-item"
                  v-for="extra in extras"
                  :key="extra.name"
                  @click="addExtra(extra)"
                >
                  <div class="option-data">
                    {{ extra.name }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="btn-confirm-wrap">
            <div class="btn-confirm yes-confirm is-alert">Ok</div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
      </div>

      <div
        class="popup-type type-change-price-product"
        v-if="isActiveChangePricePopup"
      >
        <div class="popup-heading">
          <div class="popup-btn-heading">
            <div
              class="btn-heading"
              :class="{ 'is-active': isChangePriceProductAmount }"
              @click="doChangePriceType(true)"
            >
              Price
            </div>
            <div
              class="btn-heading"
              :class="{ 'is-active': !isChangePriceProductAmount }"
              @click="doChangePriceType(false)"
            >
              Total price
            </div>
          </div>
          <div class="row-data">
            {{ valueNewPrice | centToEuroFormat }}
          </div>
          <div class="row-data type-input">
            <div class="input big-size">
              {{ valueNewPrice }}
            </div>
          </div>
        </div>
        <div class="popup-main">
          <div class="popup-numpad">
            <div class="numpad">
              <div class="number-box">
                <ul class="number-list">
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('7')"
                    >
                      <span>7</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('8')"
                    >
                      <span>8</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('9')"
                    >
                      <span>9</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('4')"
                    >
                      <span>4</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('5')"
                    >
                      <span>5</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('6')"
                    >
                      <span>6</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('1')"
                    >
                      <span>1</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('2')"
                    >
                      <span>2</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('3')"
                    >
                      <span>3</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('00')"
                    >
                      <span>00</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('0')"
                    >
                      <span>0</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                  <li class="number-item">
                    <div
                      class="number-btn"
                      @click="clickNumBtnChangePrice('clear')"
                    >
                      <span>C</span>
                      <div class="overlay-btn"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="confirmChangePrice()"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Close
            </div>
          </div>
        </div>
      </div>

      <div class="popup-type type-product-togo" v-if="isActiveTogoPopup">
        <div class="popup-heading">
          <h2>Confirm To-Go?</h2>
        </div>
        <div class="popup-main">
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="confirmTogo()"
            >
              Yes
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Close
            </div>
          </div>
        </div>
      </div>

      <!-- gắn với keyboard -->
      <div
        class="popup-type type-password-storno"
        v-if="isActivePopupPasswordAdmin"
      >
        <div class="popup-heading">
          <h2>Enter password of manager</h2>
        </div>
        <div class="popup-main">
          <div class="text-input">
            <input
              type="password"
              id="input-password-storno"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
              ref="inputPasswordStorno"
            />
          </div>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="doCheckPasswordAdmin('storno')"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
        <div class="popup-notice" v-if="isWrongPasswordAdmin">
          Password is invalid
        </div>
      </div>

      <!-- gắn với keyboard -->
      <div
        class="popup-type popup-type-large type-reason-storno"
        v-if="isActivePopupReasonStorno"
      >
        <div class="popup-heading">
          <h2>Enter reason to storno</h2>
        </div>
        <div class="popup-main">
          <div class="text-input">
            <input
              type="text"
              id="input-reason-storno"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
              ref="inputReasonStorno"
            />
            <div class="clear-text-btn" @click="clearInput()">
              <span>Clear</span>
            </div>
          </div>
          <ul class="list-button">
            <li
              class="button-item"
              v-for="(reason, index) in reasons"
              :key="index"
            >
              <div class="button-item-text" @click="chooseReason(reason.name)">
                {{ reason.name }}
              </div>
            </li>
          </ul>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="doSetReasonStorno()"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
        <div class="popup-notice" v-if="isReasonStornoInvalid">
          Please enter the reason
        </div>
      </div>

      <!-- gắn với keyboard -->
      <div
        class="popup-type type-password-admin"
        v-if="isActivePopupPasswordAdminRetour"
      >
        <div class="popup-heading">
          <h2>Enter password of manager</h2>
        </div>
        <div class="popup-main">
          <div class="text-input">
            <input
              type="password"
              id="input-password-retour"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
              ref="inputPasswordRetour"
            />
          </div>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="doCheckPasswordAdmin('retour')"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
        <div class="popup-notice" v-if="isWrongPasswordAdmin">
          Password is invalid
        </div>
      </div>

      <!-- gắn với keyboard -->
      <div
        class="popup-type type-password-admin"
        v-if="isActivePopupPasswordAdminUmsatz"
      >
        <div class="popup-heading">
          <h2>Enter password of manager</h2>
        </div>
        <div class="popup-main">
          <div class="text-input">
            <input
              type="password"
              id="input-password-umsatz"
              @focus="
                showHidePopupKeyboard(true);
                triggerInputElement($event);
              "
              @input="onInputChange"
              ref="inputPasswordUmsatz"
            />
          </div>
          <div class="btn-confirm-wrap">
            <div
              class="btn-confirm yes-confirm is-alert"
              @click="doCheckPasswordAdmin('umsatz')"
            >
              Ok
            </div>
            <div class="btn-confirm no-confirm" @click="closePopup()">
              Cancel
            </div>
          </div>
        </div>
        <div class="popup-notice" v-if="isWrongPasswordAdmin">
          Password is invalid
        </div>
      </div>

      <PopupNewSession />
      <PopupChangeTextError />
      <PopupRemoveArea />
      <PopupTableBusy />
      <PopupTableNotAvailable />
      <PopupNeedConfirmProduct />
      <PopupNoProductForPay />
      <PopupConfirmCloseSession />
      <PopupMoveDish ref="popupMoveDish" />
      <PopupConfirmMoveDish />
      <PopupChangeUser />
      <PopupConfirmChangeUser />
      <PopupCheckValidPayment />
      <PopupOrderNotEmpty />
      <PopupAlertSelectProduct />
      <PopupNoticeOrderConfirm />
      <PopupAlertDiscount />
      <PopupAlertChangePrice />
      <PopupInvalidQuantityProductOrderline />
      <PopupNoProductByPlu />
      <PopupReasonRetour />
      <PopupAlertEnterRetourInput />
      <PopupNoProductRetour />
      <PopupChangePaymentMethod />
    </div>
    <KeyboardPopup
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
import KeyboardPopup from "@/components/elements/keyboard/KeyboardPopup.vue";
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";
import OrderService from "@/services/OrderService.js";

import PopupNewSession from "@/components/elements/popup/PopupNewSession.vue";
import PopupChangeTextError from "@/components/elements/popup/PopupChangeTextError.vue";
import PopupRemoveArea from "@/components/elements/popup/PopupRemoveArea.vue";
import PopupTableBusy from "@/components/elements/popup/PopupTableBusy.vue";
import PopupTableNotAvailable from "@/components/elements/popup/PopupTableNotAvailable.vue";
import PopupNeedConfirmProduct from "@/components/elements/popup/PopupNeedConfirmProduct.vue";
import PopupNoProductForPay from "@/components/elements/popup/PopupNoProductForPay.vue";
import PopupConfirmCloseSession from "@/components/elements/popup/PopupConfirmCloseSession.vue";
import PopupMoveDish from "@/components/elements/popup/PopupMoveDish.vue";
import PopupConfirmMoveDish from "@/components/elements/popup/PopupConfirmMoveDish.vue";
import PopupChangeUser from "@/components/elements/popup/PopupChangeUser.vue";
import PopupConfirmChangeUser from "@/components/elements/popup/PopupConfirmChangeUser.vue";
import PopupCheckValidPayment from "@/components/elements/popup/PopupCheckValidPayment.vue";
import PopupOrderNotEmpty from "@/components/elements/popup/PopupOrderNotEmpty.vue";
import PopupAlertSelectProduct from "@/components/elements/popup/PopupAlertSelectProduct.vue";
import PopupNoticeOrderConfirm from "@/components/elements/popup/PopupNoticeOrderConfirm.vue";
import PopupAlertDiscount from "@/components/elements/popup/PopupAlertDiscount.vue";
import PopupAlertChangePrice from "@/components/elements/popup/PopupAlertChangePrice.vue";
import PopupInvalidQuantityProductOrderline from "@/components/elements/popup/PopupInvalidQuantityProductOrderline.vue";
import PopupNoProductByPlu from "@/components/elements/popup/PopupNoProductByPlu.vue";
import PopupReasonRetour from "@/components/elements/popup/PopupReasonRetour.vue";
import PopupAlertEnterRetourInput from "@/components/elements/popup/PopupAlertEnterRetourInput.vue";
import PopupNoProductRetour from "@/components/elements/popup/PopupNoProductRetour.vue";
import PopupChangePaymentMethod from "@/components/elements/popup/PopupChangePaymentMethod.vue";

export default {
  components: {
    KeyboardPopup: KeyboardPopup,
    PopupNewSession: PopupNewSession,
    PopupChangeTextError: PopupChangeTextError,
    PopupRemoveArea: PopupRemoveArea,
    PopupTableBusy: PopupTableBusy,
    PopupTableNotAvailable: PopupTableNotAvailable,
    PopupNeedConfirmProduct: PopupNeedConfirmProduct,
    PopupNoProductForPay: PopupNoProductForPay,
    PopupConfirmCloseSession: PopupConfirmCloseSession,
    PopupMoveDish: PopupMoveDish,
    PopupConfirmMoveDish: PopupConfirmMoveDish,
    PopupChangeUser: PopupChangeUser,
    PopupConfirmChangeUser: PopupConfirmChangeUser,
    PopupCheckValidPayment: PopupCheckValidPayment,
    PopupOrderNotEmpty: PopupOrderNotEmpty,
    PopupAlertSelectProduct: PopupAlertSelectProduct,
    PopupNoticeOrderConfirm: PopupNoticeOrderConfirm,
    PopupAlertDiscount: PopupAlertDiscount,
    PopupAlertChangePrice: PopupAlertChangePrice,
    PopupInvalidQuantityProductOrderline: PopupInvalidQuantityProductOrderline,
    PopupNoProductByPlu: PopupNoProductByPlu,
    PopupReasonRetour: PopupReasonRetour,
    PopupAlertEnterRetourInput: PopupAlertEnterRetourInput,
    PopupNoProductRetour: PopupNoProductRetour,
    PopupChangePaymentMethod: PopupChangePaymentMethod,
  },

  data() {
    return {
      maxDiscountByPercent: 20,
      isWrongPasswordAdmin: false,
      isReasonStornoInvalid: false,
      currentItemScrollTo: 0,
      reasons: [
        {
          id: 1,
          name: "Fehlbestellung",
        },
        {
          id: 2,
          name: "Vertippt",
        },
        {
          id: 3,
          name: "Umbestellung",
        },
        {
          id: 4,
          name: "Gast hat sich umentschieden",
        },
        {
          id: 5,
          name: "Artikel Kalt",
        },
        {
          id: 6,
          name: "Artikel Verbrannt",
        },
        {
          id: 7,
          name: "Artikel Versalzen",
        },
        {
          id: 8,
          name: "Reklamation Sonstige",
        },
        {
          id: 9,
          name: "Zechprellerei",
        },
      ],
      // biến bàn phím ảo
      input: "",
      inputNameSelected: "",
      inputValueSelected: "",
      inputSelected: "",
    };
  },

  computed: {
    ...mapState({
      isActivePopup: (state) => state.popup.isActivePopup,
      isActiveChangeTextPopup: (state) => state.table.isActiveChangeTextPopup,
      isActiveProductDiscountPopup: (state) =>
        state.order.isActiveProductDiscountPopup,
      lineDiscountPercentage: (state) => state.order.lineDiscountPercentage,
      valueDiscount: (state) => state.order.valueDiscount,
      isActiveExtraOrderline: (state) => state.order.isActiveExtraOrderline,
      orderSelected: (state) => state.order.orderSelected,
      orders: (state) => state.order.orders,
      isActiveChangePricePopup: (state) => state.order.isActiveChangePricePopup,
      isChangePriceProductAmount: (state) =>
        state.order.isChangePriceProductAmount,
      valueNewPrice: (state) => state.order.valueNewPrice,
      isActiveTogoPopup: (state) => state.order.isActiveTogoPopup,
      isActiveKeyboard: (state) => state.helper.isActiveKeyboard,
      tableNameSelected: (state) => state.table.tableNameSelected,
      isActivePopupPasswordAdmin: (state) =>
        state.popup.isActivePopupPasswordAdmin,
      isActivePopupReasonStorno: (state) =>
        state.popup.isActivePopupReasonStorno,
      isDoStornoAll: (state) => state.helper.isDoStornoAll,
      isOverDiscount: (state) => state.helper.isOverDiscount,
      discountLocation: (state) => state.helper.discountLocation,
      extras: (state) => state.product.extras,
      isOnSmallScreen: (state) => state.helper.isOnSmallScreen,
      isValidValueDiscount: (state) => state.helper.isValidValueDiscount,
      isActivePopupPasswordAdminRetour: (state) =>
        state.popup.isActivePopupPasswordAdminRetour,
      isActivePopupPasswordAdminUmsatz: (state) =>
        state.popup.isActivePopupPasswordAdminUmsatz,
    }),
  },

  methods: {
    closePopup() {
      this.$store.dispatch("popup/closePopup");

      // clear change text input
      this.input = "";

      // this.$refs.inputPasswordRetour.value = '';
      // this.$refs.inputPasswordUmsatz.value = '';
      // this.$refs.inputPasswordStorno.value = '';

      this.isWrongPasswordAdmin = false;
      this.$store.commit("helper/setStornoAll", false);
      this.$store.commit("helper/setStateOverDiscount", false);
    },

    doChangeText() {
      this.$store.commit("table/updateChangeTextInput", this.input);
      this.$store.dispatch("table/changeText");
      this.showHidePopupKeyboard(false);

      // clear change text input
      this.input = "";
    },

    changeDiscountState(value) {
      this.$store.dispatch("order/changeDiscountState", value);
    },

    clickNumBtnDiscount(valueInput) {
      let tmpDiscount = this.valueDiscount;

      if (valueInput == "clear") {
        this.$store.commit("order/setValueDiscount", "");
        return;
      }

      if (tmpDiscount === "") {
        if (valueInput !== "00") {
          tmpDiscount += valueInput;
        } else {
          return;
        }
      } else {
        tmpDiscount += valueInput;
      }
      tmpDiscount = tmpDiscount;

      this.$store.commit("order/setValueDiscount", tmpDiscount);
    },

    confirmDiscount(isCheckPassword = true) {
      this.$store.commit("helper/setStateValidDiscountValue", false);

      let tmpDiscount = this.valueDiscount;

      if (this.discountLocation !== "payment") {
        // confirm discount ở page home
        if (tmpDiscount == "") {
          return;
        } else {
          let tmpOrderLines = this.orderSelected.orderLines;
          let tmpProduct = {};
          let totalPrice = 0;
          let maxDiscount = 0;

          for (let i = 0; i < tmpOrderLines.length; i++) {
            if (tmpOrderLines[i].isHighlight) {
              tmpProduct = { ...tmpOrderLines[i] };
            }
          }
          totalPrice = Number(tmpProduct.quantity) * Number(tmpProduct.price);

          this.$store.commit("helper/setStateValidDiscountValue", true);
          maxDiscount =
            Number(totalPrice) * (Number(this.maxDiscountByPercent) / 100); //Giảm giá tối đa 20%
          if (!this.lineDiscountPercentage) {
            // Giảm giá theo giá tiền
            if (Number(tmpDiscount) / 100 >= totalPrice) {
              // nếu giảm giá quá tổng tiền
              this.$store.commit("helper/setStateValidDiscountValue", false);
              return;
            } else {
              if (tmpDiscount / 100 <= maxDiscount) {
                tmpDiscount = tmpDiscount / 100;
                tmpProduct.isOverDiscount = false;
              } else {
                if (isCheckPassword) {
                  this.$store.commit("helper/setStateOverDiscount", true);
                  this.$store.dispatch("popup/updatePopupState", true);
                  this.$store.dispatch("popup/updatePopupPasswordAdmin", true);
                  this.$store.dispatch("order/showHidePopupDiscount", false);
                  return;
                } else {
                  tmpDiscount = Number(tmpDiscount) / 100;
                  tmpProduct.isOverDiscount = true;
                }
              }
              tmpProduct.discount = tmpDiscount;
              tmpProduct.discountType = "€";
            }
          } else {
            // Giảm giá theo %
            if (Number(tmpDiscount) >= 100) {
              // không cho giảm lớn hơn hoặc bằng 100% giá
              this.$store.commit("helper/setStateValidDiscountValue", false);
              return;
            } else {
              if (tmpDiscount <= this.maxDiscountByPercent) {
                tmpProduct.isOverDiscount = false;
              } else {
                if (isCheckPassword) {
                  this.$store.commit("helper/setStateOverDiscount", true);
                  this.$store.dispatch("popup/updatePopupState", true);
                  this.$store.dispatch("popup/updatePopupPasswordAdmin", true);
                  this.$store.dispatch("order/showHidePopupDiscount", false);
                  return;
                } else {
                  tmpProduct.isOverDiscount = true;
                }
              }
              tmpProduct.discount = tmpDiscount;
              tmpProduct.discountType = "%";
            }
          }

          tmpProduct.isDiscount = true;
          tmpProduct.quantity = 0;
          tmpProduct.priceAfterChange = 0;
          this.$store.dispatch("order/setProductToOrderLines", [tmpProduct]);
          this.closePopup();
        }
      } else {
        // confirm discount ở page payment
        if (tmpDiscount == "") {
          return;
        } else {
          let orderDiscountValueTmp = 0;
          let tmpOrderSelected = { ...this.orderSelected };

          if (this.lineDiscountPercentage) {
            // giảm giá theo %
            if (Number(tmpDiscount) >= 100) {
              // nếu giảm giá lớn hơn hoặc bằng 100% tổng tiền order
              this.$store.commit("helper/setStateValidDiscountValue", false);
              return;
            } else {
              orderDiscountValueTmp =
                (Number(tmpOrderSelected.totalPrice) * tmpDiscount) / 100;
              if (
                orderDiscountValueTmp >
                  Number(tmpOrderSelected.orderDiscountMax) ||
                Number(tmpOrderSelected.orderDiscountMax) < 0
              ) {
                // giảm giá quá 20% tổng giá tiền hoặc số tiền giảm giá nhiều nhất là âm (đã giảm giá quá nhiều khi order)
                if (isCheckPassword) {
                  // khi chưa confirm password quản lý
                  this.$store.commit("helper/setStateOverDiscount", true);
                  this.$store.dispatch("order/showHidePopupDiscount", false);
                  this.$store.dispatch("popup/updatePopupPasswordAdmin", true);
                  return;
                }
              }

              tmpOrderSelected.orderDiscountValue = tmpDiscount;
              tmpOrderSelected.orderDiscountType = "%";
              tmpOrderSelected.moneyToPay =
                Number(tmpOrderSelected.totalPrice) -
                (Number(tmpOrderSelected.totalPrice) * Number(tmpDiscount)) /
                  100;

              this.closePopup();
            }
          } else {
            // giảm giá theo giá tiền
            tmpDiscount = Number(tmpDiscount) / 100;

            if (Number(tmpDiscount) >= Number(tmpOrderSelected.totalPrice)) {
              // nếu giảm giá lớn hơn hoặc bằng tổng tiền order
              this.$store.commit("helper/setStateValidDiscountValue", false);
              return;
            } else {
              if (
                tmpDiscount > Number(tmpOrderSelected.orderDiscountMax) ||
                Number(tmpOrderSelected.orderDiscountMax) < 0
              ) {
                // giảm giá quá 20% tổng giá tiền hoặc số tiền giảm giá nhiều nhất là âm (đã giảm giá quá nhiều khi order)
                if (isCheckPassword) {
                  // khi chưa confirm password quản lý
                  this.$store.commit("helper/setStateOverDiscount", true);
                  this.$store.dispatch("order/showHidePopupDiscount", false);
                  this.$store.dispatch("popup/updatePopupPasswordAdmin", true);

                  return;
                }
              }

              tmpOrderSelected.orderDiscountValue = Number(tmpDiscount);
              tmpOrderSelected.orderDiscountType = "€";
              tmpOrderSelected.moneyToPay =
                Number(tmpOrderSelected.totalPrice) - Number(tmpDiscount);

              this.closePopup();
            }
          }

          tmpOrderSelected.moneyChange =
            Number(tmpOrderSelected.moneyGiven) -
            Number(tmpOrderSelected.moneyToPay);

          for (let order of this.orders) {
            if (order.ref === tmpOrderSelected.ref) {
              order.orderDiscountValue = tmpOrderSelected.orderDiscountValue;
              order.orderDiscountType = tmpOrderSelected.orderDiscountType;
              order.moneyToPay = tmpOrderSelected.moneyToPay;
              order.moneyChange = tmpOrderSelected.moneyChange;
            }
          }

          this.$store.commit("order/setOrderSelected", tmpOrderSelected);
          this.$store.commit("order/setOrders", this.orders);
        }
      }
    },

    quickDiscount(value) {
      if (this.discountLocation !== "payment") {
        // confirm discount ở page home
        let tmpOrderLines = this.orderSelected.orderLines;
        let tmpProduct = {};
        let tmpDiscount = value;

        for (let i = 0; i < tmpOrderLines.length; i++) {
          if (tmpOrderLines[i].isHighlight) {
            tmpProduct = { ...tmpOrderLines[i] };
          }
        }

        tmpProduct.discount = tmpDiscount;
        tmpProduct.discountType = "%";
        tmpProduct.isDiscount = true;
        tmpProduct.quantity = 0;
        tmpProduct.priceAfterChange = 0;
        tmpProduct.isOverDiscount = false;
        this.$store.dispatch("order/setProductToOrderLines", [tmpProduct]);
        this.closePopup();
      } else {
        // confirm discount ở page payment
        let tmpDiscount = value;
        let orderDiscountValueTmp = 0;
        let tmpOrderSelected = { ...this.orderSelected };

        orderDiscountValueTmp =
          (Number(tmpOrderSelected.totalPrice) * tmpDiscount) / 100;
        if (orderDiscountValueTmp > Number(tmpOrderSelected.orderDiscountMax)) {
          // giảm giá quá 20% tổng giá tiền
          this.$store.commit("order/setValueDiscount", tmpDiscount);
          this.changeDiscountState("percent");
          this.$store.commit("helper/setStateOverDiscount", true);
          this.$store.dispatch("order/showHidePopupDiscount", false);
          this.$store.dispatch("popup/updatePopupPasswordAdmin", true);

          return;
        } else {
          tmpOrderSelected.orderDiscountValue = tmpDiscount;
          tmpOrderSelected.orderDiscountType = "%";
          tmpOrderSelected.moneyToPay =
            Number(tmpOrderSelected.totalPrice) - Number(orderDiscountValueTmp);

          tmpOrderSelected.moneyChange =
            Number(tmpOrderSelected.moneyGiven) -
            Number(tmpOrderSelected.moneyToPay);

          for (let order of this.orders) {
            if (order.ref === tmpOrderSelected.ref) {
              order.orderDiscountValue = tmpOrderSelected.orderDiscountValue;
              order.orderDiscountType = tmpOrderSelected.orderDiscountType;
              order.moneyToPay = tmpOrderSelected.moneyToPay;
              order.moneyChange = tmpOrderSelected.moneyChange;
            }
          }

          this.$store.commit("order/setOrderSelected", tmpOrderSelected);
          this.$store.commit("order/setOrders", this.orders);

          // console.log(this.orderSelected);

          this.closePopup();
        }
      }
    },

    doChangePriceType(value) {
      this.$store.commit("order/setChangePriceType", value);
    },

    clickNumBtnChangePrice(valueInput) {
      let tmpNewPrice = this.valueNewPrice;

      if (valueInput == "clear") {
        this.$store.commit("order/setValueNewPrice", "");
        return;
      }

      if (tmpNewPrice === "") {
        if (valueInput !== "00") {
          tmpNewPrice += valueInput;
        } else {
          return;
        }
      } else {
        tmpNewPrice += valueInput;
      }
      tmpNewPrice = tmpNewPrice;

      this.$store.commit("order/setValueNewPrice", tmpNewPrice);
    },

    confirmChangePrice() {
      let tmpNewPrice = this.valueNewPrice;
      if (tmpNewPrice == "") {
        return;
      } else {
        let tmpOrderLines = this.orderSelected.orderLines;
        let tmpProduct = {};
        let priceBuffer = 0;

        tmpNewPrice = Number(tmpNewPrice) / 100;
        for (let i = 0; i < tmpOrderLines.length; i++) {
          if (tmpOrderLines[i].isHighlight) {
            tmpProduct = { ...tmpOrderLines[i] };
          }
        }

        if (this.isChangePriceProductAmount) {
          // ở trạng thái thay giá của sản phẩm
          if (tmpNewPrice >= Number(tmpProduct.priceOrigin)) {
            // thay giá lớn hơn giá gốc
            tmpProduct.price = tmpNewPrice;
            tmpProduct.discount = 0;
            tmpProduct.isOverDiscount = false;
          } else {
            // thay giá nhỏ hơn giá gốc - giá thay không nhỏ hơn 80% giá gốc
            let maxDiscount =
              Number(tmpProduct.priceOrigin) *
              (Number(this.maxDiscountByPercent) / 100);
            let newPriceBuffer =
              Number(tmpProduct.priceOrigin) - Number(tmpNewPrice);

            if (newPriceBuffer > maxDiscount) {
              // giá giảm không thỏa mãn điều kiện
              tmpNewPrice =
                Number(tmpProduct.priceOrigin) - Number(maxDiscount);
              tmpProduct.isOverDiscount = true;
            } else {
              // giá giảm thỏa mãn điều kiện
              tmpProduct.isOverDiscount = false;
            }
            priceBuffer = Number(tmpProduct.priceOrigin) - Number(tmpNewPrice);
            tmpProduct.discount = priceBuffer * Number(tmpProduct.quantity);
            tmpProduct.price = tmpProduct.priceOrigin;
          }
          tmpProduct.priceAfterChange = tmpNewPrice;
        } else {
          // ở trạng thái thay giá tổng của sản phẩm
          let totalAmountOrigin =
            Number(tmpProduct.priceOrigin) * Number(tmpProduct.quantity);

          if (totalAmountOrigin <= tmpNewPrice) {
            // tổng tiền lớn mới lớn hơn tổng tiền của giá gốc
            tmpProduct.price = tmpNewPrice / Number(tmpProduct.quantity);
            tmpProduct.priceAfterChange =
              tmpNewPrice / Number(tmpProduct.quantity);
            tmpProduct.discount = 0;
            tmpProduct.isOverDiscount = false;
          } else {
            // tổng tiền lớn mới nhỏ hơn tổng tiền của giá gốc - giá thay tổng tiền không nhỏ hơn 80% tổng tiền giá gốc
            let maxDiscountTotal =
              Number(tmpProduct.priceOrigin) *
              Number(tmpProduct.quantity) *
              (Number(this.maxDiscountByPercent) / 100);
            let totalDiscountBuffer =
              Number(tmpProduct.priceOrigin) * Number(tmpProduct.quantity) -
              Number(maxDiscountTotal);

            tmpProduct.price = tmpProduct.priceOrigin;
            if (tmpNewPrice >= totalDiscountBuffer) {
              // tổng tiền mới thỏa mãn điều kiện
              tmpProduct.priceAfterChange =
                tmpNewPrice / Number(tmpProduct.quantity);
              tmpProduct.discount = 0;
              tmpProduct.isOverDiscount = false;
            } else {
              // tổng tiền mới không thỏa mãn điều kiện
              tmpNewPrice = totalDiscountBuffer;
              tmpProduct.priceAfterChange =
                Number(tmpNewPrice) / Number(tmpProduct.quantity);
              tmpProduct.isOverDiscount = true;
            }
          }
        }

        tmpProduct.discountType = "€";
        tmpProduct.isChangePrice = true;
        tmpProduct.quantity = 0;
        this.$store.dispatch("order/setProductToOrderLines", [tmpProduct]);
        this.closePopup();
      }
    },

    confirmTogo() {
      this.$store.dispatch("order/handleOrderTogo");
      this.closePopup();
    },

    doCheckPasswordAdmin(type) {
      this.isReasonStornoInvalid = false;

      if (this.input == "123") {
        this.isWrongPasswordAdmin = false;

        // clear value input
        this.input = "";

        if (type === "retour") {
          // clear value input
          this.$refs.inputPasswordRetour.value = "";
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("popup/updatePopupPasswordAdminRetour", false);
          this.$router.push({
            path: "/list-ordered",
            query: { type: "retour" },
          });
          return;
        }

        if (type === "umsatz") {
          // clear value input
          this.$refs.inputPasswordUmsatz.value = "";
          this.$store.dispatch("popup/updatePopupState", false);
          this.$store.dispatch("popup/updatePopupPasswordAdminUmsatz", false);
          this.$router.push({ path: "/print" });
          return;
        }

        if (type === "storno") {
          // clear value input
          this.$refs.inputPasswordStorno.value = "";

          if (this.isOverDiscount) {
            this.confirmDiscount(false);
          } else {
            this.$store.dispatch("popup/updatePopupPasswordAdmin", false);
            this.$store.dispatch("popup/updatePopupReasonStorno", true);
            this.showHidePopupKeyboard(false);
          }
          return;
        }
      } else {
        this.isWrongPasswordAdmin = true;
      }
    },

    // doCheckPasswordAdminStorno() {
    //   this.isReasonStornoInvalid = false;

    //   if(this.input == '123') {
    //     this.isWrongPasswordAdmin = false;

    //     // clear value input
    //     this.input = '';
    //     this.$refs.inputPasswordStorno.value = '';

    //     if(this.isOverDiscount) {
    //       this.confirmDiscount(false);
    //     } else {
    //       this.$store.dispatch('popup/updatePopupPasswordAdmin', false);
    //       this.$store.dispatch('popup/updatePopupReasonStorno', true);
    //       this.showHidePopupKeyboard(false);
    //     }
    //   } else {
    //     this.isWrongPasswordAdmin = true;
    //   }
    // },

    async doSetReasonStorno() {
      if (this.input !== "") {
        this.isReasonStornoInvalid = false;

        if (!this.isDoStornoAll) {
          // thực hiện storno
          this.$store.commit("order/setReasonStorno", this.input);
          this.$store.dispatch("order/doStorno");
        } else {
          // thực hiện storno all
          this.$store.commit("order/setReasonStornoAll", this.input);
          this.$store.dispatch("order/doStornoAll", true);

          this.$store.commit("helper/showLoading", true);
          // add order lên API để lấy số beleg hiển thị ở page in
          OrderService.addOrder(this.orderSelected).then((orderResp) => {
            this.$store.commit("order/setBelegOrder", orderResp.beleg);
            // lưu order lên server
            OrderService.save().then(() => {
              this.$store.commit("helper/showLoading", false);

              this.$store.dispatch("payment/calculateOrderPayment", [
                this.orders,
                this.orderSelected,
              ]);
              this.$router.push({ path: "print" });
            });
          });
        }
        this.$store.dispatch("popup/updatePopupState", false);
        this.$store.dispatch("popup/updatePopupReasonStorno", false);
        this.showHidePopupKeyboard(false);

        // clear value input
        this.input = "";
      } else {
        this.isReasonStornoInvalid = true;
      }
    },

    addExtra(extra) {
      this.$store.dispatch("order/setExtraForProduct", extra);
    },

    handleScrollList(direction) {
      let list = this.$refs.extraList;
      let nextScroll = 60;

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

    chooseReason(valReason) {
      this.input += valReason;
      this.$refs.inputReasonStorno.value = this.input;
      this.inputNameSelected = this.$refs.inputReasonStorno.id;
      this.inputValueSelected = this.$refs.inputReasonStorno.value;

      setTimeout(() => {
        this.$refs.keyboard.setInputValue();
      }, 0);

      this.showHidePopupKeyboard(false);
    },

    clearInput() {
      this.input = "";
      this.$refs.inputReasonStorno.value = this.input;

      setTimeout(() => {
        this.$refs.keyboard.clearInput();
      }, 0);

      this.showHidePopupKeyboard(false);
    },

    // method bàn phím ảo
    showHidePopupKeyboard(value) {
      if (!this.$device.android && !this.$device.ios) {
        this.$store.dispatch("helper/updateKeyboardState", value);
        this.$store.dispatch("helper/showHidePopupKeyboard", value);
      }
    },

    triggerInputElement(e) {
      this.inputSelected = `#${e.target.id}`;
      this.inputNameSelected = e.target.id;

      setTimeout(() => {
        this.$refs.keyboard.setInputName();
      }, 0);
    },

    onChange(input) {
      this.input = input;
      document.querySelector(this.inputSelected).value = input;
    },

    onInputChange(e) {
      // tracking các input change được tạo ra không phải từ bàn phím ảo
      this.input = e.target.value;
      this.inputValueSelected = e.target.value;

      setTimeout(() => {
        this.$refs.keyboard.setInputValue();
      }, 0);
    },
  },

  created() {},
};
</script>

<style lang="scss"></style>
