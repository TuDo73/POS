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
      sessionUser: state => state.sessionUser.sessionUser
    })
  },

  methods: {
    async getSessionUser() {
      if(globalFunction.checkIsObjEmpty(this.sessionUser)) {
        this.$store.commit('helper/showLoading', true);

        let userName = this.user.username;
        let url = globalFunction.baseUrl + 'session/get_by_user';
        let postBody = {
          'username': userName
        }
        let sessionData = await globalFunction.request(url, postBody);
        
        sessionData = JSON.parse(sessionData.data)[0];
        this.$store.commit('sessionUser/setSessionUserData', sessionData);
        
        this.$store.commit('helper/showLoading', false);
      }
    }
  },

  created() {
    this.getSessionUser();
  }
};
