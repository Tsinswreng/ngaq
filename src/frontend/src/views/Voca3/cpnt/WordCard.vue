<script setup lang="ts">
import {RMB_FGT } from '@shared/entities/Word/MemorizeWord';
import {WebMemorizeWord} from '@ts/voca3/entities/WebMemorizeWord'
import {ref, Ref, onBeforeMount} from 'vue'
import { WebVocaUi } from '../WebVocaUi';
import { WordEvent } from '@shared/entities/Word/Word';
import { $ } from '@shared/Ut';

const loaded = ref(false)
let ui:WebVocaUi// = await WebVocaUi.getInstanceAsync()
onBeforeMount( async() => {
	ui = await WebVocaUi.getInstanceAsync()
	loaded.value = true
	ui.test()
})

// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
	memorizeWord: WebMemorizeWord;
	loopIndex: integer
}>();
const mw = props.memorizeWord
// const emits = defineEmits([/* 自定义事件名称列表 */]);
const emits = defineEmits(['WordCardClick']);

function returnWordToParent(){
	const wordToSend = props.memorizeWord
	emits('WordCardClick', wordToSend);
	//reciteStatus.value = 'rmb'
};

// function handleWordEvent(event:WordEvent){
// 	multiMode.showNextRandomBg()
// 	multiMode.isSaved.value = false
// 	if(reciteStatusRef.value === 'nil'){
// 		recite.trigger(props.memorizeWord, event)
// 		if(event === WordEvent.RMB){
// 			reciteStatusRef.value = 'rmb'
			
// 		}else if(event === WordEvent.FGT){
// 			reciteStatusRef.value = 'fgt'
// 		}
// 	}
// 	else{
// 		undo()
// 	}
// 	returnWordToParent()
// }

// function rightClick(event: MouseEvent){
// 	event.preventDefault()
// 	if(reciteStatusRef.value === 'nil'){
// 		if(event.button === 2){
// 			handleWordEvent(WordEvent.FGT)
// 		}
// 	}else{undo()}
// }

// function undo(){
// 	if(reciteStatusRef.value !== 'nil'){
// 		recite.undo(props.memorizeWord)
// 		reciteStatusRef.value = 'nil'
// 	}
// }

// function fmtNum(num:number, fix:number){
// 	let exp = num.toExponential()
// 	let [baseStr, exponentialStr] = exp.split('e')
// 	const base = parseFloat(baseStr)
// 	baseStr = base.toFixed(fix)
// 	return baseStr + 'e' + exponentialStr
// }

// function rmb(){
// 	ui.learnByWord($(mw), WordEvent.RMB)
// }

// function fgt(){
// 	ui.learnByWord($(mw), WordEvent.FGT)
// }

// function undo(){
// 	return ui.undoByWord($(mw))
// }

const reciteStatusRef = mw.uiStuff.reciteStatusRef
const isAddTimeGeq3 = (wb:WebMemorizeWord)=>{
	if(wb == void 0){
		return false
	}
	return wb.word.times_add >= 3
}
</script>

<template>
	<div v-if="loaded" class="word-card" :class="isAddTimeGeq3(mw)?'addTimeGeq3':void 0">

		<span class="w-index" :class="reciteStatusRef" @click="ui.learnByWord(mw, WordEvent.FGT)">{{ props.loopIndex }}</span>
		<span class="w-shape" @click="ui.learnByWord(mw, WordEvent.RMB)" @contextmenu="">
			{{ mw.word.wordShape }}
		</span>
		
		<!-- <span id="w-id" @click="testPrintPrio(props.wordB)">
			{{ props.wordB.fw.id }}
		</span> -->
		<span>{{ mw.word.times_add }}</span>:
		<span>{{ mw.word.times_rmb }}</span>:
		<span>{{ mw.word.times_fgt }}</span>
		<span>_____</span>
		<span class="w-weight">{{ mw.weight }}</span>
		<!-- <span class="w-lastRvwDate">{{ mw.date__event[mw.date__event.length-1].tempus }}</span> -->
		<!-- <span class="w-dates_add">{{ props.wordB.getAddDates() }}</span> -->
		<span class="w-eventsSymbols">{{}}</span>
		<span class="w-lastEvent">{{}}</span>
		
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
/* .addTimeGeq3{

} */
.addTimeGeq3 .w-shape{
	color: rgb(0, 255, 255);
	/* font-weight: bold; */
	/* text-decoration: underline; */
}

.word-card{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box; */
	display: flex;
	/* align-items: stretch; 默认值，使左右两个子元素的高度相同 */
	align-items: right;
	text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; /* 添加黑色边框 */
}
/* 
元素過多旹設此會卡頓
.word-card:hover{
	outline: 1px solid gray;
	box-sizing: border-box;
} */

.w-index{
	width: 40px
}
.w-shape{
	/* font-weight: bold; */
	font-size: large;
	display: inline-block;
	/* font-size: 20px; */
	/* height: 60px; */
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 150px
}

.w-id{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 30px;
	display: inline-block; /* 设置为行内块级元素 */
}

.w-weight{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 80px;
}

.w-dates_add{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 260px;
	font-size: 6px;
}

.w-eventsSymbols{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 55px;
	font-size: 16px;
	white-space: pre;
	
}

.w-lastRvwDate{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 55px;
}

.w-lastEvent{
	opacity: 0.5;
}
.upper{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	display: inline-block; /* 设置为行内块级元素 */
	vertical-align: top; /* 使元素在上部对齐，与左侧的元素对齐 */
}

.lower{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
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

../Status@shared/entities/Word/SvcWord@ts/voca3/entities/WebSvcWord