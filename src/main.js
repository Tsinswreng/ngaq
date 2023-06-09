"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
require("./style.css");
const App_vue_1 = require("./App.vue");
const VocaServer_1 = require("./VocaServer");
(0, vue_1.createApp)(App_vue_1.default).mount('#app');
VocaServer_1.default.main();
