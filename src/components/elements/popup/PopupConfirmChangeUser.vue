<template>
  <div class="popup-type type-confirm-move-dish" v-if="isActivePopupConfirmChangeUser">
    <div class="popup-heading">
      <h2>{{userChangeTableOrigin.fullname}} wants to change table to {{userChangeTableTarget.fullname}}</h2>
    </div>
    <div class="popup-main">
      <div class="btn-confirm-wrap">
        <div class="btn-confirm yes-confirm is-alert" @click="confirmChangeUser()">Confirm</div>
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
        isActivePopupConfirmChangeUser: state => state.order.isActivePopupConfirmChangeUser,
        dataChangeUserSocket: state => state.order.dataChangeUserSocket,
        userChangeTableOrigin: state => state.tableFunction.userChangeTableOrigin,
        userChangeTableTarget: state => state.tableFunction.userChangeTableTarget,
      })
    },

    methods: {
      closePopup() {
        this.$socket.emit('CANCEL_CHANGE_USER', '');
      },

      confirmChangeUser() {
        this.$store.commit('helper/showLoading', true);
        this.$socket.emit('RECEIVE_CHANGE_USER', '');
      }
    },

    created() {},
  };
</script>

<style>

</style>
