import Vue from 'vue2';
import './style.css';
import App from './App.vue';

new Vue({
    render: h => h(App as any),
}).$mount('#app-content');
