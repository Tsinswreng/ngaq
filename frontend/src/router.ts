import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from './views/login.vue'
import Home from './views/Home.vue'
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
	}
]

const router = createRouter
({
	history: createWebHistory(),
	routes: routes
})

export default router