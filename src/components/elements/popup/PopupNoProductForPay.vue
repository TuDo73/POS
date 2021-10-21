<template>
  <div class="popup-type" v-if="isActivePopupNoProductForPay">
    <div class="popup-heading">
      <h2>No product for pay</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm no-confirm" @click="closePopup()">Close</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalFunction } from '@/global/global.js'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        isActivePopupNoProductForPay: state => state.popup.isActivePopupNoProductForPay,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
      },
    },

    created() {},
  };
</script>

<style>

</style>
