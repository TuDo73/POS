import store from '@/store'
import { globalFunction } from '@/global/global.js'

export default {
  async getAll() {
    let urlTable = globalFunction.baseUrl + 'table/getall';
    let allTables = await globalFunction.request(urlTable);

    store.commit('table/setDataTable', allTables);
  }
}