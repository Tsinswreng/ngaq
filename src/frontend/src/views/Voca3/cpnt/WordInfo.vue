<!-- 固定ʹ 單詞詳情框 -->
<script setup lang="ts">
import { $ } from '@shared/Ut';
import {SvcWord} from '@shared/entities/Word/SvcWord'
import {WebVocaUi} from '../WebNgaqUi';
import { ref } from 'vue';
const loaded = ref(false)
let ui:WebVocaUi
;(async()=>{
	ui = await WebVocaUi.getInstanceAsync()
	loaded.value = true
})()
// const props = defineProps<{
// 	memorizeWord: SvcWord|undefined
// }>()
</script>
<template>
	<div class="container" v-if="loaded"> <!-- 不用寫.vaule -->
		<div class="wordInfo" v-if="ui.uiStuff.isShowWordInfo.value"> <!-- 要寫.value -->
			<!-- <CtrlPanel class="CtrlPanel" @CtrlPanel:start="ui.uiStuff.isShowCardBox.value=true;"></CtrlPanel> -->
			<div>{{ ui.curWord?.word.table??'' + ui.curWord?.word.id??'' }}</div>
			<div class="w-eventSymbols"> wordB_nn.getEventSymbols() </div>
			<div>MemorizeWord.style_getAddDates(wordB_nn)</div>
			<hr class="w-hr">
			<div class="w-shape">{{ ui.curWord?.word.wordShape??'' }}</div>
			<div>
				<span>wordB_nn.fw.annotation.length===0?'':wordB_nn.fw.annotation</span>
				<span>wordB_nn.fw.tag.length===0?'':wordB_nn.fw.tag</span>
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
</style>@shared/entities/Word/SvcWord../WebNgaqUi../WebNgaqUi