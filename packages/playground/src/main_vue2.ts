import Vue from 'vue2';
import './style.css';
import App from './App.vue';
import {router} from './router';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

new Vue({
    render: h => h(App as any),
    // @ts-ignore
    router,
}).$mount('#app-content');
