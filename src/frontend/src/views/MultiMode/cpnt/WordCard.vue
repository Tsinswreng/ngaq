<script setup lang="ts">
	import WordB from '@ts/voca/WordB';
	import { ref, Ref } from 'vue';
	import { WordEvent } from '@shared/SingleWord2';
	import Recite from '@ts/voca/Recite';
	import MultiMode from '../MultiMode';
import { lastOf } from '@shared/Ut';

	//let word = defineProps<SingleWord2>()
	//console.log(words)
	//let w = words[0]
// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
	wordB: WordB; // 假设 YourDataType 是 e 的数据类型
	loopIndex: number
}>();
// const emits = defineEmits([/* 自定义事件名称列表 */]);
const emits = defineEmits(['WordCardClick']);

const recite = Recite.getInstance()
const multiMode = MultiMode.getInstance()
function returnWordToParent(){
	const wordToSend = props.wordB
	emits('WordCardClick', wordToSend); // 第一個參數是事件ᵗ名、第二個是將傳ᵗ訊。
	//console.log(wordToSend)
	//reciteStatus.value = 'rmb'
};

function handleWordEvent(event:WordEvent){
	multiMode.showNextRandomBg()
	multiMode.isSaved.value = false
	if(reciteStatusRef.value === 'nil'){
		recite.trigger(props.wordB, event)
		if(event === WordEvent.RMB){
			reciteStatusRef.value = 'rmb'
			
		}else if(event === WordEvent.FGT){
			reciteStatusRef.value = 'fgt'
		}
	}
	else{
		undo()
	}
	returnWordToParent()
}



function rightClick(event: MouseEvent){
	event.preventDefault()
	if(reciteStatusRef.value === 'nil'){
		if(event.button === 2){
			handleWordEvent(WordEvent.FGT)
		}
	}else{undo()}
	//console.log(reciteStatus.value)//t
	//console.log(props.wordB.neoDates_rmb)//t
	//console.log(props.wordB.neoDates_fgt)//t
}

function undo(){
	if(reciteStatusRef.value !== 'nil'){
		recite.undo(props.wordB)
		reciteStatusRef.value = 'nil'
	}
}


let reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')

</script>

<template>
	<div class="word-card">
		<span class="w-shape" @click="handleWordEvent(WordEvent.RMB)" @contextmenu="rightClick" :class="reciteStatusRef">
			{{ props.wordB.fw.wordShape }}
		</span>
		<span class="w-index" @click="handleWordEvent(WordEvent.FGT)">{{ props.loopIndex }}</span>
		<!-- <span id="w-id" @click="testPrintPrio(props.wordB)">
			{{ props.wordB.fw.id }}
		</span> -->

		<span class="w-priority">{{ (props.wordB.priority.prio0num).toFixed(2) }}</span>
		<span class="w-lastRvwDate">{{ props.wordB.getLastRvwDate() }}</span>
		<!-- <span class="w-dates_add">{{ props.wordB.getAddDates() }}</span> -->
		<span class="w-eventsSymbols">{{props.wordB.getEventSymbolCnt() }}</span>
		<span class="w-lastEvent">{{ lastOf(props.wordB.getEventSymbols()) }}</span>
		
		<!-- <span>{{ reciteStatusRef }}</span> -->

		<!-- <span class="upper">
			upper
		</span>
		<span class="lower">
			lower
		</span> -->
	</div>
</template>

<style scoped>


.word-card{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	display: flex;
	/* align-items: stretch; 默认值，使左右两个子元素的高度相同 */
	align-items: right;
	text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; /* 添加黑色边框 */
}


.w-index{
	width: 40px
}
.w-shape{
	/* font-weight: bold; */
	font-size: large;
	display: inline-block;
	/* font-size: 20px; */
	/* height: 60px; */
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 150px
}

.w-id{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 30px;
	display: inline-block; /* 设置为行内块级元素 */
}

.w-priority{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 80px;
}

.w-dates_add{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 260px;
	font-size: 6px;
}

.w-eventsSymbols{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 55px;
	font-size: 16px;
	white-space: pre;
	
}

.w-lastRvwDate{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	width: 55px;
}

.w-lastEvent{
	opacity: 0.5;
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
	background-color: rgb(0, 80, 0, 0.5);
	/* box-sizing: border-box;
	border: rgb(0, 64, 0, 0.5) solid 10px; */
}

.fgt{
	background-color: rgb(80, 0, 0, 0.5);
}
*{
	opacity: 0.95;
}
</style>

../Status