<script setup lang="ts">
/* ref 是 Vue.js 3 中的一个响应式函数。它接受一个初始值，并返回一个响应式的引用对象。
引用对象包装了传入的初始值，并提供了访问和修改该值的方法。当引用对象的值发生变化时，相关的组件将自动更新。 */
import { ref } from 'vue';
import MenuItem from './MenuItem.vue';
import menuItems from './menuItems'

// booleano para contraer o expandir menú
let collapsed = ref(true);
let status:string = collapsed? '+':'-'
</script>

<template>
<!-- clase menu, y si es verdadero collapsed va a aplicar clase collapsed, sino expanded -->
<aside :class="['menu', collapsed ? 'collapsed' : 'expanded']">
	<div class="header">
		<button class="menu-button" @click.prevent="collapsed = !collapsed">
			<!-- <font-awesome-icon icon="fa-solid fa-bars" size="2x"/> -->
			{{ collapsed? '+':'-' }}
		</button>
	</div>
	<div class="profile" v-if="!collapsed">
		<img class="profile__img" src="../assets/profile.svg" :alt=menuItems.profile.img>
		<!-- cuando este expandido (no collapsed) se va a mostrar name -->
		<div class="profile__name"> <a href="#" @click.prevent="menuItems.profile.onClick">{{ menuItems.profile.name }}</a> </div>
	</div>
	<hr class="cyan" v-if="!collapsed">
	<div class="menu__item">
		<ul>
			<!-- <MenuItem v-if="!collapsed" v-for="item in menuItems.items" :key="item.id" :item="item" :collapsed="!collapsed"/> -->
			<MenuItem v-if="!collapsed" v-for="item in menuItems.items" :key="item.id" :item="item" :collapsed="collapsed"/>
		</ul>
		<ul>
			<MenuItem v-if="!collapsed" v-for="item in menuItems.items" :key="item.id" :item="item" :collapsed="!collapsed"/>
		</ul>
	</div>
</aside>

</template>

<style scoped>
.menu{
	border-color: var(--colorNegro);
/* vh 是 CSS 中的一个长度单位，表示视口高度的百分比。具体来说，1vh 等于视口高度的 1%。
视口（viewport）是指浏览器窗口中用于显示网页内容的区域。视口的高度取决于用户的浏览器窗口大小或设备的屏幕大小。 */
	height: 100vh;
	transition: width .05s;
/* 元素的位置将不会随页面滚动而改变，而是相对于视口的某个位置固定显示。 */
	position: fixed;
	left: 0;
	top: 0;
	font-size: 2rem;
}

.collapsed{
	width: 4rem;
	/* height: 4.4rem; */
	background-color: var(--menuBackground);
}

.expanded{
	width: 35rem;
	background-color: var(--menuBackground);
}

.header{
/* 顶部和底部边距设为 0，并将左右边距设置为自动。 */
	margin: 0 auto;
	/* 弹性布局 */
	display: flex;
/* 内部元素在主轴上的对齐方式设置为末端对齐。内部元素将沿着主轴末端对齐，并留下额外的空间在主轴的起始端。 */
	/* justify-content: end; */
}

.cyan{
	border-color: var(--highLight);
	height: 0px;
}

.menu-button{
	position: fixed;
	width: 4rem;
	height: 4rem;
	border: none;
	background-color: transparent;
	margin: 0 0 0 0 ;
	display: block;
	font-size: 2rem;
}

.menu-button:hover{
	background-color: var(--highLight);
}

.profile{
	display: flex;
	padding: var(--separacion);
	gap: var(--separacion);
	align-items: center;
}

.profile:hover{
	background-color: var(--highLight);
}

.profile__img {
	width: 4.4rem;
}

.profile__name {
	text-align: center;
}

/* 对 .profile__name 类内的 <a> 元素应用的样式 */

.profile__name a{
/* 文本装饰样式设置为无 */
	text-decoration: none;
/* 将链接文本的大小写转换为首字母大写 */
	text-transform: capitalize;
}

.menu__item {

}

.menu__item ul {
	padding: 0;
/* 去除列表（<ul> 和 <ol>）元素的默认样式 */
	list-style: none;
	margin: 0;
}

</style>