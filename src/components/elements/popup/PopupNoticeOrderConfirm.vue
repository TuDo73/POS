<template>
  <div class="popup-type" v-if="isActiveNoticeOrderConfirmPopup">
    <div class="popup-heading">
      <h2>Action is not avaiable for product confirmed</h2>
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
        isActiveNoticeOrderConfirmPopup: state => state.popup.isActiveNoticeOrderConfirmPopup,
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
