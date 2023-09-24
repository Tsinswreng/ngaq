import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from './views/login.vue'
import Home from './views/Home.vue'
import MonoMode from './views/MonoMode.vue'
import Old_MonoMode from "./views/Old_MonoMode.vue";
import TypingTest from "./views/TypingTest.vue";
import MultiMode from '@views/MultiMode/MultiMode.vue';
import Manage from '@views/Manage/Manage.vue';

/* interface Route{
	path:string
	component: object
} */

const routes:RouteRecordRaw[] = 
[
	{
		path:'/',
		component: Home
	},
	{
		path: '/login',
		component: login
	},
	{
		path: '/Manage',
		component: Manage
	},
	{
		path: '/MultiMode',
		component: MultiMode
	},
	{
		path: '/monoMode',
		component: MonoMode
	},
	{
		path: '/oldMonoMode',
		component: Old_MonoMode
	},
	{
		path: '/typingTest',
		component: TypingTest
	}
]

const router = createRouter
({
	history: createWebHistory(),
	routes: routes
})

export default router