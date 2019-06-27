import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import infiniteScroll from 'vue-infinite-scroll'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(infiniteScroll)
Vue.config.productionTip = false

// 图片预览插件
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
// Vue.use(Viewer)
// Viewer.setDefaults({
//   Options: {
//     inline: true,
//     button: true,
//     navbar: true,
//     title: true,
//     toolbar: true,
//     tooltip: true,
//     movable: true,
//     zoomable: true,
//     rotatable: true,
//     scalable: true,
//     transition: true,
//     fullscreen: true,
//     keyboard: true,
//     url: 'data-source'
//   }
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
