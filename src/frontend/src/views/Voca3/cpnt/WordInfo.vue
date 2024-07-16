<!-- 固定ʹ 單詞詳情框 -->
<script setup lang="ts">
import { $ } from '@shared/Ut';
import {SvcWord3} from '@shared/entities/Word/SvcWord3'
import {WebNgaqUi} from '../WebNgaqUi';
import { ref } from 'vue';
import { WebSvcWord } from '@ts/voca3/entities/WebSvcWord';
import Tempus from '@shared/Tempus';
const loaded = ref(false)
let ui:WebNgaqUi
;(async()=>{
	ui = await WebNgaqUi.getInstanceAsync()
	loaded.value = true
})()
// const props = defineProps<{
// 	memorizeWord: SvcWord3|undefined
// }>()

function eventsMark(ui:WebNgaqUi){
	const sb = [] as str[]
	function _(word:SvcWord3){
		for(let i = 0; i < word.date__event.length; i++){
			const event = word.date__event[i].event
			const ua = WebSvcWord.eventMark(event)
			sb.push(ua)
		}
		return sb.join('')
	}
	if(ui.curWord!= void 0){
		return _(ui.curWord)
	}
	return ''
}

function annotation(ui:WebNgaqUi){
	const tar = ui.curWord?.word.annotation??''
	if(tar.length > 0){
		return JSON.stringify(tar)
	}
	return ''
}

function tags(ui:WebNgaqUi){
	const tar = ui.curWord?.word.tag??''
	if(tar.length > 0){
		return JSON.stringify(tar)
	}
	return ''
}

function addDates(ui:WebNgaqUi){
	function _(svcWord:SvcWord3){
		const dates = svcWord.word.dates_add
		return dates.map(e=>Tempus.format(e, 'YY.MM.DD')).join('|')
	}
	if(ui.curWord == void 0){
		return ''
	}
	return _(ui.curWord)
}
</script>
<template>
	<div class="container" v-if="loaded"> <!-- 不用寫.vaule -->
		<div class="wordInfo" v-if="ui.uiStuff.isShowWordInfo.value"> <!-- 要寫.value -->
			<!-- <CtrlPanel class="CtrlPanel" @CtrlPanel:start="ui.uiStuff.isShowCardBox.value=true;"></CtrlPanel> -->
			<!-- <div>{{ ui.curWord?.word.table??'' + ui.curWord?.word.id??'' }}</div> -->
			<div>{{ (ui.curWord?.word.belong??'') + (ui.curWord?.word.id??'') }}</div>
			<div class="w-eventSymbols"> {{ eventsMark(ui) }} </div>
			<!-- <div>MemorizeWord.style_getAddDates(wordB_nn)</div> -->
			<div>{{ addDates(ui) }}</div>
			<hr class="w-hr">
			<div class="w-shape">{{ ui.curWord?.word.wordShape??'' }}</div>
			<div>
				<!-- <span>{{ ui.curWord?.word.annotation.length?'':ui.curWord?.word.annotation }}</span> -->
				<span> {{ annotation(ui) }} </span>
				<span>{{ tags(ui) }}</span>
			</div>
			<hr class="w-hr">
			<div class="w-mean">{{ ui.curWord?.word.mean.join('\n')}}</div>
		</div>
	</div>
</template>
<style scoped>
/* .wordInfo{
	overflow: scroll;
} */

.w-hr{
	/* color: gray; 不效、需改界ᵗ色*/
	border-color: gray;
	margin: 0;
}

.w-shape{
	font-size: 32px;
	font-weight: 600;
	
}

.container{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
}
.CtrlPanel{
	/* position: fixed; */
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	/* display: block; */
	margin: 0 auto 0 auto;
}
.w-mean{
	white-space: pre-wrap;
}
.w-eventSymbols{
	white-space: wrap;
	font-size: 12px;
}
</style>