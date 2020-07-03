// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import App from './App.vue';
// import VueGoodTable from '../dist/vue-good-table.esm';
// import '../dist/vue-good-table.css';
import VueGoodTable from '../src';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';

Vue.use(BootstrapVue);
Vue.use(VueGoodTable);



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
