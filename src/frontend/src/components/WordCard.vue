<script setup lang="ts">
	import words from '@ts/voca/testCase'
	import SingleWord2 from '@shared/SingleWord2';
	import moment from 'moment';
	//let word = defineProps<SingleWord2>()
	//console.log(words)
	//let w = words[0]
// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
  wordData: SingleWord2; // 假设 YourDataType 是 e 的数据类型
}>();
/* 	function simplifyDate(date:string):string;
	function simplifyDate(date:string[]):string[];

	function simplifyDate(date:string|string[]){

		if(typeof(date) === 'string'){

		}
	} */

	
</script>

<template>
	{{ wordData }}
	{{ props }}
	<div class="word-card">
		<!-- <table>
			<tr>
				<td>id</td>
				<td>{{ w.id }}</td>
			</tr>
			<tr>
				<td>wordShape</td>
				<td>{{ w.wordShape }}</td>
			</tr>
			<tr>
				<td>dates_add</td>
				<td>{{ w.dates_add }}</td>
			</tr>
		</table> -->
	</div>
</template>

<style scoped>
word-card{
	border: solid 10px white;
}
</style>

