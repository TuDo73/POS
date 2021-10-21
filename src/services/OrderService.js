import store from '@/store'
import { globalFunction } from '@/global/global.js'

export default {
  async save() {
    let urlSetOrder = globalFunction.baseUrl + 'socket/setorder';
    let orderObj = {
      'order': store.state.order.orders,
      'username': store.state.user.user.username
    };
    let setOrderResponse = await globalFunction.request(urlSetOrder, orderObj);
  },

  async setRefOrder(ref, userCode) {
    let urlSetRefOrder = globalFunction.baseUrl + 'temp_order_ref/add';
    let orderRefObj = {
      'ref': ref,
      'username': userCode
    };
    let setRefOrderResponse = await globalFunction.request(urlSetRefOrder, orderRefObj);
  },

  async getRefOrder(userCode) {
    let urlGetRefOrder = globalFunction.baseUrl + 'temp_order_ref/select';
    let orderRefObj = {
      'username': userCode
    };
    let getRefOrderResponse = await globalFunction.request(urlGetRefOrder, orderRefObj);

    return getRefOrderResponse;
  },

  async getOrdersByUser(userCode) {
    let urlGetOrder = globalFunction.baseUrl + 'socket/getorder';
    let orderObj = {
      'username': userCode
    };
    
    let orders = await globalFunction.request(urlGetOrder, orderObj);

    return orders;
  },

  async getOrdersByDate(userCode, fromDate, toDate) {
    let url = globalFunction.baseUrl + 'order/selectbyuser';
    let paramBody = {
      'usercode': userCode,
      'fromdate': fromDate,
      'todate': toDate
    };

    let orders = await globalFunction.request(url, paramBody);
    
    return orders;
  },

  async getOrderByRef(ref) {
    let url = globalFunction.baseUrl + 'order/selectbyref';
    let paramBody = {
      'ref': ref
    };

    let order = await globalFunction.request(url, paramBody);

    return order;
  },

  async addOrder(order) {
    let url = globalFunction.baseUrl + 'gastro/order/add';
    let orderTmp = globalFunction.deepCloneObj(order);
    let paramBody = {};

    // thêm field product_id là unix cho mỗi orderline để BE xử lý
    for (let i = 0; i < orderTmp.orderLines.length; i++) {
      if (orderTmp.orderLines[i].product_id == '' || !globalFunction.checkValid(orderTmp.orderLines[i].product_id)) {
        orderTmp.orderLines[i].product_id = i + orderTmp.orderLines[i].code + orderTmp.ref;
      }
    }

    paramBody = orderTmp;
    // console.log('orderTmp:', orderTmp);
    
    let orderResp = await globalFunction.request(url, paramBody);
    return orderResp;
  }
}