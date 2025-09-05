/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Routes
import router from './router/router.js';

//Vuetify
import vuetify from './plugins/vuetify';

const app = createApp(App)

registerPlugins(app)

app.use(router);
app.mount('#app');
