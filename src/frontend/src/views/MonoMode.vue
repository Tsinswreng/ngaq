<template>
	<div>
		<li v-for="e in w">{{e}} {{','}}</li>
	</div>
</template>
<script setup lang="ts">
	import { ref, onMounted } from 'vue'; // 引入需要的 Vue 3 函數
	import BtnPanel from '@components/btnPanel.vue';
	import MainWord from '@components/mainWord.vue';
	import VocaData from '@ts/voca/VocaData';
	import Ut from '@shared/Ut'

	console.log()

	let w = ref([]); // 使用 ref 創建 w 作為響應式數據
	
	// 使用 onMounted 鉤子在組件掛載後執行異步操作
	onMounted(async () => {
		try {
			(w.value as any) = await VocaData.fetchWords();
			console.log(w.value);
		} catch (error) {
			console.error('發生錯誤：', error);
		}
	});
</script>