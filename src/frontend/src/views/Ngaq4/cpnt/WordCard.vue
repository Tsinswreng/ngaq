<script setup lang="ts">
import {WebSvcWord} from '@ts/ngaq4/entities/WebSvcWord'
import {ref, Ref, onBeforeMount} from 'vue'
import { WebNgaqUi } from '../WebNgaqUi';
import { $ } from '@shared/Common';
import {SvcWord} from '@shared/logic/memorizeWord/SvcWord'
import Tempus from '@shared/Tempus';
import { LearnBelong } from '@shared/model/word/NgaqRows';

const WordEvent = LearnBelong
const loaded = ref(false)
let ui:WebNgaqUi// = await WebVocaUi.getInstanceAsync()
onBeforeMount( async() => {
	ui = await WebNgaqUi.getInstanceAsync()
	loaded.value = true
	ui.test()
})

// 定义 props，此处需要和父组件传递的 prop 名字一致
const props = defineProps<{
	svcWord: WebSvcWord;
	loopIndex: int
}>();
const mw = props.svcWord
const wordIndex = props.loopIndex
// const emits = defineEmits([/* 自定义事件名称列表 */]);
const emits = defineEmits(['WordCardClick']);

function returnWordToParent(){
	const wordToSend = props.svcWord
	emits('WordCardClick', wordToSend);
	//reciteStatus.value = 'rmb'
};


function rightClick(event:MouseEvent){
	event.preventDefault()
	ui.learnOrUndoByIndex(wordIndex, WordEvent.fgt)
}

function fmtNum(num:number, fix:number){
	let exp = num.toExponential()
	let [baseStr, exponentialStr] = exp.split('e')
	const base = parseFloat(baseStr)
	baseStr = base.toFixed(fix)
	return baseStr + 'e' + exponentialStr
}

function lastEventSymbol(w:SvcWord){
	switch(w.learns[w.learns.length-1].belong){
		case WordEvent.add:
			return '🤔'
		break;
		case WordEvent.rmb:
			return '✅'
		break;
		case WordEvent.fgt:
			return '❌'
		break;
	}
}

const reciteStatusRef = mw.uiStuff.reciteStatusRef

class WordColor{
	gray = ref('gray')
	white = ref('white')
	green = ref('green')
	blue = ref('blue')
	red = ref('red')
	get(svcWord:SvcWord){
		const z = this
		const c = svcWord.countsOfEvent(WordEvent.add)
		//return ref('testDefault')
		if(c<= 1){
			return z.gray
		}
		else if(c===2){
			return z.white
		}else if(c===3){
			return z.green
		}else if(c===4){
			return z.blue
		}else if(c >= 5){
			return z.red
		}
		return z.white
	}

}
const wordColorRef = new WordColor()

function fmtDate(tempus:Tempus){
	//return Tempus.format(tempus, 'YY.MM.DD')
	const day = 1000*60*60*24
	const timeDiff = Tempus.diff_mills(
		Tempus.new()
		,tempus
	)
	const dayCnt = timeDiff/day
	return dayCnt.toFixed(0)
}


</script>

<template>
	<div
		v-if="loaded" class="word-card-container"
		:class = wordColorRef.get(svcWord).value
	> <!-- :class="isAddTimeGeq3(mw)?'addTimeGeq3':void 0" -->

		<span 
			class="w-index" :class="reciteStatusRef" 
			@click="ui.learnOrUndoByIndex(wordIndex, WordEvent.fgt)"
		>
			{{ props.loopIndex }}
		</span>
		<span
			class="w-shape"
			@click="ui.learnOrUndoByIndex(wordIndex, WordEvent.rmb)"
			@contextmenu="rightClick"
		>
			{{ mw.wordText }}
		</span>
		<span class="w-lastEvent">{{ lastEventSymbol(mw) }}</span>
		<!-- <span id="w-id" @click="testPrintPrio(props.wordB)">
			{{ props.wordB.fw.id }}
		</span> -->
		<span class="timesCnt">{{ mw.countsOfEvent(WordEvent.add) }}</span>
		<span class="timesCnt">{{ mw.countsOfEvent(WordEvent.rmb) }}</span>
		<span class="timesCnt">{{ mw.countsOfEvent(WordEvent.fgt) }}</span>
		<!-- <span>_____</span> -->
		<span class="w-weight">{{ fmtNum(mw.weight??0,2) }}</span>
		<span class="w-lastRvwDate">{{ fmtDate($(mw.learns.at(-1)).ct) }}</span>
		<!-- <span class="w-dates_add">{{ props.wordB.getAddDates() }}</span> -->
		<!-- <span class="w-eventsSymbols">{{  }}</span> -->
		
		<!-- <span>{{ reciteStatusRef }}</span> -->

		<!-- <span class="upper">
			upper
		</span>
		<span class="lower">
			lower
		</span> -->
	</div>
</template>

<style scoped lang="scss">

:root{
	--blue: rgb(0, 255, 255);
	--gray: rgb(128, 128, 128);
	--white: rgb(255, 255, 255);
	--green: rgb(0, 255, 128);
	--yellow: rgb(255, 255, 0);
	--red: rgb(255, 0, 0);
}

.testDefault{
	color: blue;
}

.gray .w-shape{
	/* color: var(--gray); */
	color: rgb(180, 180, 180)
}

.white .w-shape{
	/* color: var(--white); */
	color: rgb(255, 255, 255);
}

.green .w-shape{
	/* color: var(--green); */
	color: rgb(0, 255, 128);
}

.blue .w-shape{
	/* color: var(--blue); */
	color: rgb(0, 255, 255);
}

.yellow .w-shape{
	/* color: var(--yellow); */
	color:  rgb(255, 255, 0);
}

.red .w-shape{
	/* color: var(--red); */
	color: rgb(255, 0, 0);
}

span{
	outline: solid 1px rgb(76, 76, 76);  box-sizing: border-box;
}

.timesCnt{
	width: 5%;
}

/* .addTimeGeq3{

} */
.addTimeGeq3 .w-shape{
	color: rgb(0, 255, 255);
	/* font-weight: bold; */
	/* text-decoration: underline; */
}

.word-card-container{
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
	width: 6%;
}
.w-shape{
	/* font-weight: bold; */
	font-size: large;
	display: inline-block;
	/* font-size: 20px; */
	/* height: 60px; */
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	/* width: 150px */
	width: 30%;
}

.w-id{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 5%;
	display: inline-block; /* 设置为行内块级元素 */
}

.w-weight{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	/* width: 80px; */
	width: 20%;
}

.w-dates_add{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 20%;
	font-size: 6px;
}

.w-eventsSymbols{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 5%;
	font-size: 16px;
	white-space: pre;
	
}

.w-lastRvwDate{
	/* 让边框不占用宽度 */
	/* outline: solid 1px gray;  box-sizing: border-box;  */
	width: 20%;
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
	background-color: rgb(0, 80, 0, 0.8);
	/* box-sizing: border-box;
	border: rgb(0, 64, 0, 0.5) solid 10px; */
}

.fgt{
	background-color: rgb(80, 0, 0, 0.8);
}
*{
	opacity: 0.95;
}
</style>