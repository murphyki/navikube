import Vue from 'vue';
import Router from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/reset.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Router);
Vue.use(ElementUI);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'resource-explorer',
      component: require('@/components/ResourceExplorer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
