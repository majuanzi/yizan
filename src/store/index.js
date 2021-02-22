import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import hospital from './modules/hospital'

Vue.use(Vuex);
const store = new Vuex.Store({
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user,
        hospital
    }
});

export default store;
