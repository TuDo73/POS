<template>
  <div class="popup-type type-reason-retour" v-if="isActivePopupReasonRetour">
    <div class="popup-heading">
      <h2>Choose reason retour</h2>
    </div>
    <div class="popup-main">
      <ul class="reason-list">
        <li class="list-item"
          v-for="(reason, index) in reasons" :key="index"
          @click="selectReason(reason)">
          <div class="list-item-text">
            {{reason.name}}
          </div>
        </li>
      </ul>
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
        reasons: [
          {
            'id': 1,
            'name': 'Fehlbestellung'
          },
          {
            'id': 2,
            'name': 'Umbestellung'
          },
          {
            'id': 3,
            'name': 'Reklamation'
          },
          {
            'id': 4,
            'name': 'Kulanz'
          },
          {
            'id': 5,
            'name': 'Zechpreller'
          },
        ],
      };
    },

    components: {
    },

    computed: {
      ...mapState({
        isActivePopupReasonRetour: state => state.order.isActivePopupReasonRetour,
      })
    },

    methods: {
      closePopup() {
        this.$store.dispatch('popup/closePopup');
        this.$store.commit('listOrder/setActionRetour', false);
      },

      selectReason(reason) {
        this.$store.commit('listOrder/setRetourReason', reason.name);
        this.$store.commit('listOrder/setActionRetour', true);
        this.$store.dispatch('popup/closePopup');
      }
    },

    created() {},
  };
</script>

<style>

</style>
