import {createWebHistory, createRouter} from 'vue-router4';
import {routes} from './routes';

export const router = createRouter({
    history: createWebHistory(),
    routes: routes as any[],
});
