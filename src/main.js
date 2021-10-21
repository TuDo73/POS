import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueDragResize from 'vue-drag-resize'
import i18n from './i18n'
import VueSocketIO from 'vue-socket.io'
import './filters/filters'
import device from 'vue-device-detector'
import VueMoment from 'vue-moment'

Vue.config.productionTip = false

Vue.component('vue-drag-resize', VueDragResize)

Vue.use(new VueSocketIO({
  debug: true,
  connection: global_socket,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.use(device)
Vue.use(require('vue-moment'))

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  sockets: {
    connect() {
      console.log('socket connected');
    },

    disconnect() {
      console.log('socket disconnected')
    },
  }
}).$mount('#app')
