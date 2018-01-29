// 防止es6语法不支持
import 'babel-polyfill'
import 'amfe-flexible'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'
import Vuex from 'vuex'
import store from './store'
import 'common/less/index.less'
import * as _ from 'lodash'
// import vConsole from 'vconsole'
Vue.use(vueLazyLoad, {
  loading: require('common/img/default.jpeg')
})
Vue.use(Vuex)
window.addEventListener(
  'resize',
  _.debounce(function() {
    window.location.reload()
  }, 500)
)
fastclick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
