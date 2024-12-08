import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from './views/Login/login.vue'
import Home from './views/Home.vue'
import MonoMode from './views/MonoMode.vue'
//import Old_MonoMode from "./views/Old_MonoMode.vue";
import TypingTest from "./views/TypingTest.vue";
import MultiMode from '@views/MultiMode/MultiMode.vue';
import Manage from '@views/Manage/Manage.vue';
import SignUp from '@views/SignUp/SignUp.vue'
import Setttings from '@views/Settings/Settings.vue'
import Voca3 from '@views/Voca3/Voca3.vue';
import Ngaq4 from '@views/Ngaq4/Ngaq4.vue';
import Manage4 from '@views/Manage4/Manage4.vue';

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
		path: '/Settings',
		component: Setttings
	},
	{
		path: '/login',
		component: login
	},
	{
		path: '/SignUp',
		component: SignUp
	},
	{
		path: '/voca3'
		,component: Voca3
	},
	{
		path: '/ngaq4'
		,component: Ngaq4
	},
	{
		path: '/Manage',
		component: Manage
	},
	{
		path: '/Manage4',
		component: Manage4
	},
	{
		path: '/MultiMode',
		component: MultiMode
	},
	{
		path: '/monoMode',
		component: MonoMode
	},
	// {
	// 	path: '/oldMonoMode',
	// 	component: Old_MonoMode
	// },
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