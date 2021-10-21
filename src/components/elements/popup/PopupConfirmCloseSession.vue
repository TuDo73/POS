<template>
  <div class="popup-type type-confirm-close-session" v-if="isActivePopupConfirmCloseSession">
    <div class="popup-heading">
      <div class="close-session-icon">
        <span class="icon-danger-sing"></span>
      </div>
      <h2>Do you really want to close this session?</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert" @click="closeSession()">Ok</div>
        <div class="btn-confirm no-confirm" @click="closePopup()">Cancel</div>
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
        isActivePopupConfirmCloseSession: state => state.popup.isActivePopupConfirmCloseSession,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
        this.$store.dispatch('popup/updatePopupConfirmCloseSession', false);
      },

      closeSession() {
        this.closePopup();

        this.$router.push({
          path: 'print',
          query: {type: 'abschluss'}
        });
      }
    },

    created() {},
  };
</script>

<style>

</style>
