import { lsItems } from "@ts/localStorage/Items";

/* Esto sería una solicitud, un json, etc */


let i = 0;
export default{
	profile:
	{
		name: `userID: ${lsItems.userId.get()}`,
		img: '../assets/profile.svg',
		onClick(){
			window.location.href = '/login'
		}
	},
	items: 
	[
		{
			id: i++,
			title: 'Home',
			// <font-awesome-icon icon="fa-solid fa-house-user" />
			icon: 'fa-houser-user',
			onClick(){
				/* console.log(this.id) */
				window.location.href = '/'
			}
		},
		{
			id:i++,
			title: 'Log in',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				window.location.href = '/login'
			}
		},
		{
			id:i++,
			title: 'Sign up',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				window.location.href = '/signup'
			}
		},
		{
			id:i++,
			title: 'Learn',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				window.location.href = '/ngaq4'
			}
		},
		{
			id:i++,
			title: 'Manage',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				window.location.href = '/Manage4'
			}
		},
		// {
		// 	id: i++,
		// 	title: 'Voca3',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/voca3'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: 'Manage',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/Manage'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: 'MultiMode',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/MultiMode'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: '背單詞',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/monoMode'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: '背單詞(舊)',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/oldMonoMode'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: '打字測速',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/typingTest'
		// 	}
		// },
		// {
		// 	id: i++,
		// 	title: '原生舊版界面',
		// 	// <font-awesome-icon icon="fa-solid fa-info" />
		// 	icon: 'fa-info',
		// 	onClick() {
		// 		window.location.href = '/Voca.html';
		// 	}
		// }
	]
}