<script setup lang="ts">
	import WordB from '@ts/voca/WordB';
	import { ref, Ref } from 'vue';
	import { WordEvent } from '@shared/SingleWord2';
	//let word = defineProps<SingleWord2>()
	//console.log(words)
	//let w = words[0]
// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
	wordData: WordB; // 假设 YourDataType 是 e 的数据类型
}>();
// const emits = defineEmits([/* 自定义事件名称列表 */]);
const emits = defineEmits(['childClick']);


function returnWordToParent(){
	const wordToSend = props.wordData
	emits('childClick', wordToSend); // 第一個參數是事件ᵗ名、第二個是將傳ᵗ訊。
	console.log(wordToSend)
	reciteStatus.value = 'rmb'
};

function handleWordEvent(event:WordEvent){
	if(event === WordEvent.RMB){
		reciteStatus.value = 'rmb'
	}else if(event === WordEvent.FGT){
		reciteStatus.value = 'fgt'
	}
}


let reciteStatus:Ref<'rmb'|'fgt'|'nil'> = ref('nil')

</script>

<template>
	<div class="word-card" :class="reciteStatus">
		<span id="w-id">
			{{ props.wordData.fw.id }}
		</span>
		<span id="w-shape">
			{{ props.wordData.fw.wordShape }}
		</span>
		<span class="upper">
			upper
		</span>
		<span class="lower">
			lower
		</span>
	</div>
</template>

<style scoped>
.word-card{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	display: flex;
	align-items: stretch; /* 默认值，使左右两个子元素的高度相同 */
}

#w-shape{
	display: inline-block;
	font-size: 20px;
	height: 60px;
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	
}

#w-id{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 30px;
	display: inline-block; /* 设置为行内块级元素 */
}

.upper{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	display: inline-block; /* 设置为行内块级元素 */
	vertical-align: top; /* 使元素在上部对齐，与左侧的元素对齐 */
}

.lower{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	display: inline-block; /* 设置为行内块级元素 */
	vertical-align: bottom; /* 使元素在上部对齐，与左侧的元素对齐 */
}

.rmb{
	background-color: green;
}

.fgt{
	background-color: red;
}
</style>

