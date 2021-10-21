<template>
  <div class="popup-type type-change-text-error" v-if="isActiveChangeTextErrorPopup">
    <div class="popup-heading">
      <h2>Name available</h2>
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
        isActiveChangeTextErrorPopup: state => state.popup.isActiveChangeTextErrorPopup,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
      }
    },

    created() {},
  };
</script>

<style>

</style>
