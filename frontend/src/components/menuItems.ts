/* Esto sería una solicitud, un json, etc */


let i = 0;
export default{
	profile:
	{
		name: 'user name',
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
			title: 'Languages',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				console.log('Reports')
			}
		},
		{
			id:i++,
			title: 'Settings',
			// <font-awesome-icon icon="fa-regular fa-screwdriver-wrench" />
			icon: 'fa-screwdriver-wrench',
			onClick(){
				console.log('Reports')
			}
		},
		{
			id: i++,
			title: 'Terms of service',
			// <font-awesome-icon icon="fa-solid fa-info" />
			icon: 'fa-info',
			onClick() {
				console.log('Terms of service');
			}
		},
		{
			id: i++,
			title: '舊版界面',
			// <font-awesome-icon icon="fa-solid fa-info" />
			icon: 'fa-info',
			onClick() {
				window.location.href = '/Voca.html';
			}
		}
	]
}