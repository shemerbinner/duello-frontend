import { createApp } from 'vue';
import 'v-calendar/dist/style.css';
import VCalendar from 'v-calendar';
import App from './App.vue';
import router from './router';
import store from './store';
import styles from './styles/styles.scss';
import KProgress from 'k-progress-v3';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VCalendar, {});
app.component('k-progress', KProgress);
app.mount('#app');
