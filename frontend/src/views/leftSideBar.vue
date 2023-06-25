<template>
	<div class="sidebar">
	<ul>
		<li v-for="item in menuItems" :key="item.id" @click="selectMenuItem(item)">
		{{ item.name }}
		</li>
	</ul>
	</div>
</template>

<script>
export default {
	data() {
		return {
			menuItems: [
			{ id: 1, name: 'Home' },
			{ id: 2, name: 'About' },
			{ id: 3, name: 'Services' },
			{ id: 4, name: 'Contact' }
			],
			selectedItem: null
		};
		},
		methods: {
		selectMenuItem(item) {
			this.selectedItem = item;
			// 执行你的其他逻辑或导航操作
		}
	}
};
</script>

<style>
.sidebar {
	width: 200px;
	/* background-color: #f1f1f1; */
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	padding: 10px;
	cursor: pointer;
}

li:hover {
	/* background-color: #ddd; */
}
</style>