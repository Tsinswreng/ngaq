<!-- 固定ʹ 單詞詳情框 -->
<script setup lang="ts">
import { $ } from '@shared/Ut';
//import WordB from '@ts/voca/WordB';
import {MemorizeWord} from '@shared/entities/Word/MemorizeWord'
import {WebVocaUi} from '../WebVocaUi';
import CtrlPanel from './CtrlPanel.vue';
const ui = await WebVocaUi.getInstanceAsync()
const props = defineProps<{
	memorizeWord: MemorizeWord|undefined
}>()
//const wordB_nn = $(props.memorizeWord)
//console.log(`console.log(wordB_nn)`)
//console.log(wordB_nn)//t
</script>
<template>
	<div class="container">
		<div class="wordInfo">
			<!-- <CtrlPanel class="CtrlPanel" @CtrlPanel:start="ui.uiStuff.isShowCardBox.value=true;"></CtrlPanel> -->
			<div>table + id</div>
			<div class="w-eventSymbols"> wordB_nn.getEventSymbols() </div>
			<div>MemorizeWord.style_getAddDates(wordB_nn)</div>
			<hr class="w-hr">
			<div class="w-shape">wordB_nn.fw.wordShape</div>
			<div>
				<span>wordB_nn.fw.annotation.length===0?'':wordB_nn.fw.annotation</span>
				<span>wordB_nn.fw.tag.length===0?'':wordB_nn.fw.tag</span>
			</div>
			<hr class="w-hr">
			<div class="w-mean">wordB_nn.formattedMean</div>
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
</style>@shared/entities/Word/SvcWord