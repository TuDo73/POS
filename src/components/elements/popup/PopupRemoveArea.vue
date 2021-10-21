<template>
  <div class="popup-type type-remove-area" v-if="isActiveRemoveAreaPopup">
    <div class="popup-heading">
      <h2>Delete area?</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert" @click="doRemoveArea()">Yes</div>
        <div class="btn-confirm no-confirm" @click="closePopup()">No</div>
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
        isActiveRemoveAreaPopup: state => state.table.isActiveRemoveAreaPopup,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
      },

      doRemoveArea() {
        this.$store.dispatch('table/deleteArea');
      },
    },

    created() {},
  };
</script>

<style>

</style>
