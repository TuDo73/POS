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
      company: state => state.company.company,
      user: state => state.user.user
    })
  },

  methods: {
    async getCompany() {
      if(globalFunction.checkIsObjEmpty(this.user)) {
        let userLS = localStorage.getItem('login');

        userLS = JSON.parse(userLS);
        this.$store.commit('user/setUser', userLS);
      }

      if(globalFunction.checkIsObjEmpty(this.company)) {
        this.$store.commit('helper/showLoading', true);

        let userCompanyCode = this.user.userCompanyCode;
        let url = globalFunction.baseUrl + 'company/select';
        let postBody = {
          'code': userCompanyCode
        }
        let company = await globalFunction.request(url, postBody);
        this.$store.commit('company/getCompany', company[0]);

        this.$store.commit('helper/showLoading', false);
      }
    }
  },

  created() {
    this.getCompany();
  }
};
