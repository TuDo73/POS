<template>
  <div class="popup-type type-confirm-move-dish" v-if="isActivePopupConfirmMoveDish">
    <div class="popup-heading">
      <h2>{{userMoveDishTarget}} wants to move dish to table {{tableMoveDishTarget}}</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert" @click="acceptReceive()">Confirm</div>
        <div class="btn-confirm no-confirm" @click="closePopup()">Deny</div>
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
        isActivePopupConfirmMoveDish: state => state.order.isActivePopupConfirmMoveDish,
        userMoveDishTarget: state => state.tableFunction.userMoveDishTarget,
        tableMoveDishTarget: state => state.tableFunction.tableMoveDishTarget,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
        this.$socket.emit('CANCEL_MOVE_DISH');
      },

      acceptReceive() {
        this.$store.dispatch('popup/closePopup');
        this.$socket.emit('RECEIVE_MOVE_DISH');
      }
    },

    created() {},
  };
</script>

<style>

</style>
