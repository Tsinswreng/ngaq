<script setup lang="ts">
	import WordB from '@ts/voca/WordB';
	import { ref } from 'vue';
	//let word = defineProps<SingleWord2>()
	//console.log(words)
	//let w = words[0]
// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
  wordData: WordB; // 假设 YourDataType 是 e 的数据类型
}>();
// const emits = defineEmits([/* 自定义事件名称列表 */]);
const emits = defineEmits(['childClick']);

function sendDataToParent(){
	const dataToSend = props.wordData
	//emits.childClick(dataToSend);
	emits('childClick', dataToSend); // 第一個參數是事件ᵗ名、第二個是將傳ᵗ訊。
	console.log(dataToSend)
};
//const dataToSend = ref(props.wordData)
</script>

<template>
	<div class="word-card">
		<span id="w-id">
			{{ props.wordData.fw.id }}
		</span>
		<span id="w-shape" @click="sendDataToParent()">
			{{ props.wordData.fw.wordShape }}
		</span>
	</div>
</template>

<style scoped>
.word-card{
	border: solid 1px white;
}
</style>

