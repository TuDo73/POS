import store from '@/store'
import { globalFunction } from '@/global/global.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
    };
  },

  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },

  methods: {
    async getOrders() {
      this.$store.commit('helper/showLoading', true);
      this.$store.commit('helper/setStateGetOrdersFinished', false);

      let urlGetOrder = globalFunction.baseUrl + 'socket/getorder';
      let orderObj = {
        'username': this.user.username
      };
      
      let getOrderResponse = await globalFunction.request(urlGetOrder, orderObj);
      this.$store.commit('order/setOrders', getOrderResponse);

      this.$store.commit('helper/showLoading', false);
      this.$store.commit('helper/setStateGetOrdersFinished', true);
    }
  },

  created() {
    this.getOrders();
  }
};
