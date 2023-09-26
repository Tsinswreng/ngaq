<script setup lang="ts">
//import {ref} from 'vue'
import Log from '@shared/Log';
import MultiMode from '../MultiMode';
const multiMode = MultiMode.getInstance()
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

const checkedTables = multiMode.checkedTables
const isSaved = multiMode.isSaved
const debuffNumerator = multiMode.debuffNumerator
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
		<button @click="multiMode.start()">重開</button>
		<button @click="multiMode.save()">存</button>
		<!-- 坑{v-model與value=""不兼容} -->
		<div><input type="text" v-model="debuffNumerator" id="debuffNumerator"></div>
		<!-- <button></button> -->
		<div>{{ isSaved? '':'未保存' }}</div>
	</div>
</template>
<!-- <坑>{若欲父組件ʸ子組件ᵗ樣式ˇ設、則子組件須有唯一根節點。} -->
<style scoped>
#debuffNumerator{
	background: transparent;
	width: 64px
}
</style>