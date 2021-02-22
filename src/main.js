import Vue from 'vue';
import iView from 'iview';
import 'babel-polyfill';
import axios from 'axios';
import { post } from './util/http';
import { postNoToken } from './util/http';
import { httpPost, postSafe } from './util/httpPost';
import crypto from './util/crypto';
import $ from './util/util';

import { router } from './router/index';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
//import './styles/iview.css'; // 为了解决升级iview带来的 icon全变的问题

import { Select, DatePicker, Option, OptionGroup, Input } from 'element-ui';
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(OptionGroup.name, OptionGroup);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Input.name, Input);


import VCharts from 'v-charts'
import echarts from 'echarts';
Vue.use(iView);
Vue.use(VCharts)
Vue.prototype.$echarts = echarts;

//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$postNoToken = postNoToken;
Vue.prototype.$httpPost = httpPost;
Vue.prototype.$postSafe = postSafe;
Vue.prototype.$crypto = crypto;
Vue.prototype.$message = $.message;

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted() {
        this.$store.commit('updateMenulist');
    }
});

