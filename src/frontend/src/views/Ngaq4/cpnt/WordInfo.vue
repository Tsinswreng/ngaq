<!-- 固定ʹ 單詞詳情框 -->
<script setup lang="ts">
import { $ } from '@shared/Ut';
import {SvcWord} from '@shared/entities/Word/SvcWord'

import {WebNgaqUi} from '../WebNgaqUi';
import { ref } from 'vue';
import { WebSvcWord } from '@ts/ngaq4/entities/WebSvcWord';
import Tempus from '@shared/Tempus';
const loaded = ref(false)
let ui:WebNgaqUi
;(async()=>{
	ui = await WebNgaqUi.getInstanceAsync()
	loaded.value = true
})()
// const props = defineProps<{
// 	memorizeWord: SvcWord|undefined
// }>()

function eventsMark(ui:WebNgaqUi){
	const sb = [] as str[]
	function _(word:SvcWord){
		for(let i = 0; i < word.learns.length; i++){
			//const event = word.date__event[i].event
			const event = word.learns[i].belong
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

//TODO
function annotation(ui:WebNgaqUi){
	// const tar = ui.curWord?.propertys??''
	// if(tar.length > 0){
	// 	return JSON.stringify(tar)
	// }
	return ''
}

//TODO
function tags(ui:WebNgaqUi){
	// const tar = ui.curWord?.word.tag??''
	// if(tar.length > 0){
	// 	return JSON.stringify(tar)
	// }
	return ''
}

//TODO
function addDates(ui:WebNgaqUi){
	// function _(svcWord:SvcWord){
	// 	const dates = svcWord.word.dates_add
	// 	return dates.map(e=>Tempus.format(e, 'YY.MM.DD')).join('|')
	// }
	// if(ui.curWord == void 0){
	// 	return ''
	// }
	// return _(ui.curWord)
	return ''
}
</script>
<template>
	<div class="container" v-if="loaded"> <!-- 不用寫.vaule -->
		<div class="wordInfo" v-if="ui.uiStuff.isShowWordInfo.value"> <!-- 要寫.value -->
			<!-- <CtrlPanel class="CtrlPanel" @CtrlPanel:start="ui.uiStuff.isShowCardBox.value=true;"></CtrlPanel> -->
			<!-- <div>{{ ui.curWord?.word.table??'' + ui.curWord?.word.id??'' }}</div> -->
			<div>{{ 'belong+id' }}</div>
			<div class="w-eventSymbols"> {{ eventsMark(ui) }} </div>
			<!-- <div>MemorizeWord.style_getAddDates(wordB_nn)</div> -->
			<div>{{ addDates(ui) }}</div>
			<hr class="w-hr">
			<div class="w-shape">{{ ui.curWord?.word.textWord.text }}</div>
			<div>
				<!-- <span>{{ ui.curWord?.word.annotation.length?'':ui.curWord?.word.annotation }}</span> -->
				<span> {{ annotation(ui) }} </span>
				<span>{{ tags(ui) }}</span>
			</div>
			<hr class="w-hr">
			<div class="w-mean">{{ 'mean' }}</div>
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