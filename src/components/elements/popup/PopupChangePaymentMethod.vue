<template>
  <div
    class="popup-type type-change-payment-method"
    v-if="isActivePopupChangePaymentMethod"
  >
    <div class="popup-heading">
      <h2>Confirm Change payment method?</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert">Ok</div>
        <div class="btn-confirm no-confirm" @click="closePopup()">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalFunction } from "@/global/global.js";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },

  components: {},

  computed: {
    ...mapState({
      isActivePopupChangePaymentMethod: (state) =>
        state.popup.isActivePopupChangePaymentMethod,
    }),
  },

  methods: {
    closePopup() {
      this.$store.dispatch("popup/closePopup");
      this.$store.dispatch("popup/updatePopupChangePaymentMethod", false);
    },
  },

  created() {},
};
</script>

<style></style>
