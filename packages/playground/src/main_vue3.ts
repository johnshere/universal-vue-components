import {createApp} from 'vue3';
import './style.css';
import App from './App.vue';
import {router} from './router';

const app = createApp(App);

app.use(router as any);
app.mount('#app');
