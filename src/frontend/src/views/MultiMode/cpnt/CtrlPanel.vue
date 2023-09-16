<script setup lang="ts">
//import {ref} from 'vue'
import Log from '@shared/Log';
import Status from '../Status';
const status = Status.getInstance()
//import { setInterval } from 'timers/promises';
//const recite = Recite.getInstance()


//const props = defineProps()
//const emits = defineEmits(['CtrlPanel:start']);

// async function start(){
// 	l.log(`recite.start('/english')`) //t
// 	await recite.start('/english')
// 	emits('CtrlPanel:start', true)
// }

// async function save(){
// 	await recite.saveWords()
// }
let isChecked = false
let selectedItems = []
</script>

<template>
	<div>
		<div v-for="(item, index) in status.tables" :key="index">
		<input type="checkbox" :id="'checkbox-' + index" v-model="selectedItems[index]" />
		<label :for="'checkbox-' + index">{{ item }}</label>
	</div>
	<p>已選項目: {{ selectedItems }}</p>
		<button @click="status.start()">始</button>
		<button @click="status.save()">存</button>
		<!-- <button></button> -->
		<div>isSaved={{ status.isSaved }}</div>
	</div>
</template>
<!-- <坑>{若欲父組件ʸ子組件ᵗ樣式ˇ設、則子組件須有唯一根節點。} -->
<style scoped>

</style>