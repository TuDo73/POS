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
    getUserData() {
      if(globalFunction.checkIsObjEmpty(this.user)) {
        let userLS = localStorage.getItem('login');

        userLS = JSON.parse(userLS);
        this.$store.commit('user/setUser', userLS);
      }
    }
  },

  created() {
    this.getUserData();
  }
};
