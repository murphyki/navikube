import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

const k8s = require('@kubernetes/client-node')
const https = require('https')

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

Vue.prototype.$kc = kc
Vue.prototype.$kc_opts = opts

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
