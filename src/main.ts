import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VocaServer from "./VocaServer";

createApp(App).mount('#app')

VocaServer.main()
