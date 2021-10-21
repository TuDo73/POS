import store from '@/store'
import { globalFunction } from '@/global/global.js'

export default {
  async getAll() {
    let urlUser = globalFunction.baseUrl + 'user/selectall';
    let allUsers = await globalFunction.request(urlUser);

    store.commit('user/setUsers', allUsers);
  }
}