
<script setup lang="ts">
import { $ } from '@shared/Ut';
import WordB from '@ts/voca/WordB';
import CtrlPanel from './CtrlPanel.vue'
import Status from '../Status';
const status = Status.getInstance()
const props = defineProps<{
	wordB: WordB,
}>()
const wordB_nn = $(props.wordB)
//console.log(`console.log(wordB_nn)`)
//console.log(wordB_nn)//t
</script>
<template>
	<div class="WordInfo">
		<CtrlPanel class="CtrlPanel" @CtrlPanel:start="status.isShowCardBox.value=true;"></CtrlPanel>
		<h2>{{ wordB_nn.fw.wordShape }}</h2>
		<div>{{ 'id='+wordB_nn.fw.id }}</div>
		<div>{{ wordB_nn.fw.mean }}</div>
	</div>
</template>
<style scoped>
.WordInfo{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
}
.CtrlPanel{
	outline: solid 1px gray;  box-sizing: border-box; /* 让边框不占用宽度 */
	/* display: block; */
	margin: 0 auto 0 auto;
}
</style>