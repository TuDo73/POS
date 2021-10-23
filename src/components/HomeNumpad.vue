<template>
  <div class="home-numpad">
    <div class="numpad">
      <div class="number-input-box">
        <div class="number-input">
          <div
            class="number-input-item item-plu"
            :class="{ 'is-active': typeInput == 'inputPlu' }"
            @click="setTypeInput('inputPlu')"
          >
            <div class="number-input-item-label">PLU</div>
            <div class="number-input-item-data">{{ inputValuePlu }}</div>
          </div>
          <span class="number-input-icon">*</span>
          <div
            class="number-input-item item-quantity"
            :class="{ 'is-active': typeInput == 'inputQuantity' }"
            @click="setTypeInput('inputQuantity')"
          >
            <div class="number-input-item-label">Quantity</div>
            <div class="number-input-item-data">{{ inputValueQuantity }}</div>
          </div>
        </div>
      </div>
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
            <div class="number-btn" @click="clickNumBtn('0')">
              <span>0</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item large-type">
            <div class="number-btn article-btn" @click="clickNumBtn('enter')">
              <span>Article</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item large-type">
            <div class="number-btn" @click="clickNumBtn('*')">
              <span>*</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
          <li class="number-item">
            <div class="number-btn del-btn" @click="clickNumBtn('delete')">
              <span>del</span>
              <div class="overlay-btn"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      inputValuePlu: "",
      inputValueQuantity: 1,
    };
  },

  computed: {
    ...mapState({
      typeInput: (state) => state.numboardHome.typeInput,
      products: (state) => state.product.products,
      isMenge: (state) => state.numboardHome.isMenge,
      valueMenge: (state) => state.numboardHome.valueMenge,
      isNewMenge: (state) => state.numboardHome.isNewMenge,
      orderSelected: (state) => state.order.orderSelected,
    }),
  },

  components: {},

  methods: {
    initValueInput() {
      this.inputValuePlu = "";
      this.inputValueQuantity = 1;
    },

    setTypeInput(type) {
      this.$store.commit("numboardHome/setMengeState", false);
      this.$store.commit("numboardHome/setTypeInput", type);

      if (this.typeInput === "inputPlu") {
        if (this.inputValueQuantity <= 1 || this.inputValueQuantity === "") {
          this.inputValueQuantity = 1;
        }
      }

      if (this.typeInput === "inputQuantity") {
        this.inputValueQuantity = "";
      }
    },

    clickNumBtn(valueInput) {
      if (!this.isMenge) {
        if (valueInput === "delete") {
          if (this.typeInput === "inputPlu") {
            this.inputValuePlu = "";
          }

          if (this.typeInput === "inputQuantity") {
            this.inputValueQuantity = 1;
          }

          return;
        }

        if (valueInput === "enter") {
          if (this.inputValueQuantity < 1 || this.inputValueQuantity === "") {
            this.$store.dispatch("popup/updatePopupState", true);
            this.$store.dispatch(
              "numboardHome/showHidePopupInvalidQuantity",
              true
            );
            this.inputValueQuantity = "";

            return;
          }

          if (this.inputValuePlu !== "") {
            let pluSearch = this.inputValuePlu;
            let productSearch = {};

            for (let i = 0; i < this.products.length; i++) {
              if (this.products[i].plu == pluSearch) {
                productSearch = this.products[i];
                break;
              }
            }

            if (globalFunction.checkValid(productSearch.code)) {
              this.$store.commit("order/setStateForAddNewProductToOrder", true);
              productSearch.quantity = this.inputValueQuantity;
              this.$store.dispatch("order/setProductToOrderLines", [
                productSearch,
              ]);

              this.initValueInput();
              this.setTypeInput("inputPlu");
            } else {
              this.$store.dispatch("popup/updatePopupState", true);
              this.$store.dispatch("numboardHome/showHidePopupSearchPlu", true);
            }
          }
          return;
        }

        if (valueInput === "*") {
          this.setTypeInput("inputQuantity");

          return;
        }

        switch (this.typeInput) {
          case "inputPlu":
            this.inputValuePlu += valueInput;
            break;

          case "inputQuantity":
            if (this.inputValueQuantity === "") {
              if (valueInput !== "0") {
                this.inputValueQuantity += valueInput;
              }
            } else {
              this.inputValueQuantity += valueInput;
            }
            break;

          default:
            break;
        }
      } else {
        if (valueInput === "enter" || valueInput === "*") {
          return;
        }

        if (valueInput === "delete") {
          this.$store.commit("numboardHome/setValueMenge", 1);
          this.$store.commit("numboardHome/setNewMengeState", true);
          this.setMengeValueToOrderLine();
          return;
        }

        if (this.valueMenge === "") {
          if (valueInput !== "0") {
            let tmpMenge = this.valueMenge;

            tmpMenge += valueInput;
            this.$store.commit("numboardHome/setValueMenge", tmpMenge);
          } else {
            return;
          }
        } else {
          let tmpMenge = this.valueMenge;

          if (this.isNewMenge) {
            tmpMenge = "";
            this.$store.commit("numboardHome/setNewMengeState", false);
            if (valueInput == 0) {
              valueInput = 1;
            }
          }
          tmpMenge += valueInput;
          this.$store.commit("numboardHome/setValueMenge", tmpMenge);
        }

        this.setMengeValueToOrderLine();
      }
    },

    setMengeValueToOrderLine() {
      let tmpOrderLine = {};
      for (let order of this.orderSelected.orderLines) {
        if (order.isHighlight) {
          tmpOrderLine = { ...order };
        }
      }
      tmpOrderLine.quantity = this.valueMenge;
      this.$store.dispatch("order/setProductToOrderLines", [tmpOrderLine]);
    },
  },

  created() {
    this.initValueInput();
    this.$store.commit("numboardHome/setTypeInput", "inputPlu");
  },
};
</script>

<style></style>
