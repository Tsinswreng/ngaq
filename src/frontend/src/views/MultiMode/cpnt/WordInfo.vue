
<script setup lang="ts">
//TODO 釋義框不能向下滾動; debuff似不效
import { $ } from '@shared/Ut';
import WordB from '@ts/voca/WordB';
import MultiMode from '../MultiMode';
import CtrlPanel from './CtrlPanel.vue';
const multiMode = MultiMode.getInstance()
const props = defineProps<{
	wordB: WordB,
}>()
const wordB_nn = $(props.wordB)
//console.log(`console.log(wordB_nn)`)
//console.log(wordB_nn)//t
</script>
<template>
	<div class="container">
		<div class="wordInfo">
			<CtrlPanel class="CtrlPanel" @CtrlPanel:start="multiMode.isShowCardBox.value=true;"></CtrlPanel>
			<div>{{ 'id='+wordB_nn.fw.id }}</div>
			<div class="w-eventSymbols">{{ wordB_nn.getEventSymbols() }}</div>
			<div>{{ WordB.style_getAddDates(wordB_nn) }}</div>
			<hr class="w-hr">
			<div class="w-shape">{{ wordB_nn.fw.wordShape }}</div>
			<div>{{ wordB_nn.fw.annotation.length===0?'':wordB_nn.fw.annotation }}</div>
			<hr class="w-hr">
			<div class="w-mean"> {{wordB_nn.formattedMean}}</div>
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