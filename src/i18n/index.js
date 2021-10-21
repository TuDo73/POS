import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '@/store'

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: store.state.i18n.lang,
    messages: {
      'de': require('./de.json'),
      'vi': require('./vi.json')
    }
});

if (module.hot) {
  module.hot.accept(['./de.json', './vi.json'], () => {
    i18n.setLocaleMessage('de', require('./de.json'));
    i18n.setLocaleMessage('vi', require('./vi.json'));
  })
}

export default i18n;
