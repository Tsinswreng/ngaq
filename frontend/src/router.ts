import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from './views/login.vue'
import Home from './views/Home.vue'
import MonoMode from './views/MonoMode.vue'

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
		path: '/monoMode',
		component: MonoMode
	}
]

const router = createRouter
({
	history: createWebHistory(),
	routes: routes
})

export default router