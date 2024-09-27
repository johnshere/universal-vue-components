import VueRouter from 'vue-router3';
import {routes} from './routes';

export const router = new VueRouter({
    routes,
    mode: 'history',
});
