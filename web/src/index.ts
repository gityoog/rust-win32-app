import 'normalize.css/normalize.css'
import 'element-remove-polyfill'
import './style/style.scss'
import Vue from 'vue'
import HomeComponent from 'components/home'
import JSBridge from 'common/js-bridge'

new Vue({
  el: '#app',
  render(h) {
    return h(HomeComponent)
  },
  mounted() {
    JSBridge.call('ready')
  },
})
