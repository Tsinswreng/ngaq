/* Esto sería una solicitud, un json, etc */

export default{
	profile:
	{
		name: 'user name',
		img: '../assets/profile.svg',
		onClick(){
			console.log(`name: 'user name',`)
		}
	},
	items: 
	[
		{
			id: 0,
			title: 'home',
			// <font-awesome-icon icon="fa-solid fa-house-user" />
			icon: 'fa-houser-user',
			onClick(){
				console.log('home')
			}
		},
		{
			id:1,
			title: 'Reports',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				console.log('Reports')
			}
		},
		{
			id: 3,
			title: 'Terms of service',
			// <font-awesome-icon icon="fa-solid fa-info" />
			icon: 'fa-info',
			onClick() {
				console.log('Terms of service');
			}
		},
		{
			id: 4,
			title: '舊版界面',
			// <font-awesome-icon icon="fa-solid fa-info" />
			icon: 'fa-info',
			onClick() {
				window.location.href = '/Voca.html';
			}
		}
	]
}