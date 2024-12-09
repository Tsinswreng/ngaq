<!-- 固定ʹ 單詞詳情框 -->
<script setup lang="ts">
import { $ } from '@shared/Ut';
import {SvcWord} from '@shared/logic/memorizeWord/SvcWord'
import {WebNgaqUi} from '@views/Ngaq4/WebNgaqUi';
import { ref } from 'vue';
import { WebSvcWord } from '@ts/ngaq4/entities/WebSvcWord';
import Tempus from '@shared/Tempus';
import { LearnBelong, PropertyBelong } from '@shared/model/word/NgaqRows';
const loaded = ref(false)
let ui:WebNgaqUi
let fmt: typeof ui.fmt
;(async()=>{
	ui = await WebNgaqUi.getInstanceAsync()
	fmt = ui.fmt
	loaded.value = true
})()
// const props = defineProps<{
// 	memorizeWord: SvcWord|undefined
// }>()









/**
 * 23.05.26|24.05.26
 * @param ui 
 */
function fmtAddDates(ui:WebNgaqUi){
	return ui.curWord?.learnBl__learns.get(LearnBelong.add)
		?.map(e=>Tempus.format(e.ct, 'YY.MM.DD'))
		.join('|')??''
}

function mean(ui:WebNgaqUi){
	const cur = ui.curWord
	if(cur == void 0){
		return ''
	}
	const means = cur.propertyBl__propertys.get(PropertyBelong.mean)
	if(means == void 0){
		return ''
	}
	return means.map(e=>e.text+'\n').join('')
}


</script>
<template>
	<div class="container" v-if="loaded"> <!-- 不用寫.vaule -->
		<div class="wordInfo" v-if="ui.uiStuff.isShowWordInfo.value"> <!-- 要寫.value -->
			<!-- <CtrlPanel class="CtrlPanel" @CtrlPanel:start="ui.uiStuff.isShowCardBox.value=true;"></CtrlPanel> -->
			<!-- <div>{{ ui.curWord?.word.table??'' + ui.curWord?.word.id??'' }}</div> -->
			<div>{{ (ui.curWord?.belong??"")+ui.curWord?.id }}</div>
			<div class="w-eventSymbols"> {{ fmt.eventsMark() }} </div>
			<!-- <div>MemorizeWord.style_getAddDates(wordB_nn)</div> -->
			<div>{{ fmt.fmtAddDates() }}</div>
			<hr class="w-hr">
			<div class="w-shape">{{ ui.curWord?.wordText }}</div>
			<div>
				<!-- <span>{{ ui.curWord?.word.annotation.length?'':ui.curWord?.word.annotation }}</span> -->
				<!-- <span> {{ annotation(ui) }} </span>
				<span>{{ tags(ui) }}</span> -->
				<span>{{ fmt.fmtProp() }}</span>
			</div>
			<hr class="w-hr">
			<div class="w-mean">{{ fmt.mean() }}</div>
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