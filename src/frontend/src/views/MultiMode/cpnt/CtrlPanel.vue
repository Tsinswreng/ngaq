<script setup lang="ts">
//import {ref} from 'vue'
import Log from '@shared/Log';
import Status from '../MultiMode';
const status = Status.getInstance()
import {ref} from 'vue'
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

const checkedTables = status.checkedTables
const isSaved = status.isSaved
</script>

<template>
	<div>
		<!-- <span v-for="(item, index) in status.tables" :key="index">
			<input type="checkbox" :id="'checkbox-' + index" v-model="selectedItems[index]" />
			<label :for="'checkbox-' + index">{{ item }}</label>
		</span> -->
		<!-- <p>已選項目: {{ selectedItems }}</p> -->
		<input type="checkbox" v-model="checkedTables[0]" id="english"><label for="english">英</label>
		&nbsp;
		<input type="checkbox" v-model="checkedTables[1]" id="japanese"><label for="japanese">日</label>
		&nbsp;
		<input type="checkbox" v-model="checkedTables[2]" id="latin"><label for="latin">拉</label>

		<!-- <p>checkedTables={{ checkedTables }}</p> -->
		<button @click="status.start()">始</button>
		<button @click="status.save()">存</button>
		<!-- <button></button> -->
		<div>{{ isSaved? '':'未保存' }}</div>
	</div>
</template>
<!-- <坑>{若欲父組件ʸ子組件ᵗ樣式ˇ設、則子組件須有唯一根節點。} -->
<style scoped>

</style>