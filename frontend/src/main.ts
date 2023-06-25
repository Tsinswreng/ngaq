import { createApp } from 'vue'
import './style.css'

import App from './App.vue'
import voca from './voca.vue'
//import VocaServer from "./VocaServer";
//import router from './router'
//createApp(App).mount('#app')//将应用程序实例挂载到页面上的特定元素上。#app 是一个 CSS 选择器，表示选择具有 id 属性为 app 的元素作为挂载点。这意味着你的 HTML 页面中应该有一个带有 id 为 app 的元素，Vue.js 将会将应用程序渲染到该元素内部。
createApp(voca).mount('#app')
//createApp(App).use(router).mount('#app')
//VocaServer.main()
//console.log(VocaServer)
