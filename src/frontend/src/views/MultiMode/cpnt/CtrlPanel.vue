<script setup lang="ts">
//import {ref} from 'vue'
//import * as aaa from '@shared/entities/Word/MemorizeWord'
import MultiMode from '../MultiMode';
import Recite from '@ts/voca/Recite';
const multiMode = MultiMode.getInstance()
import {ref} from 'vue'
const recite = Recite.getInstance()
import LS from '@ts/LocalStorage';
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


const isSaved = multiMode.isSaved
const debuffNumerator = multiMode.debuffNumerator_str

function switchRandomImg(){
	multiMode.isShowRandomBg.value = !multiMode.isShowRandomBg.value
}

function set_page(){
	const ele = document.getElementById('paging') as HTMLInputElement
	const value = ele.value
	multiMode.set_page(value)
	multiMode.multiMode_key.value++
}
</script>

<template>
	<div>
		<!-- <span v-for="(item, index) in status.tables" :key="index">
			<input type="checkbox" :id="'checkbox-' + index" v-model="selectedItems[index]" />
			<label :for="'checkbox-' + index">{{ item }}</label>
		</span> -->
		<!-- <p>已選項目: {{ selectedItems }}</p> -->
		<!-- <input type="checkbox" v-model="checkedTables[0]" id="english"><label for="english">英</label>
		&nbsp;
		<input type="checkbox" v-model="checkedTables[1]" id="japanese"><label for="japanese">日</label> -->
		<!-- &nbsp;
		<input type="checkbox" v-model="checkedTables[2]" id="latin"><label for="latin">拉</label> -->
		
		<!-- <p>checkedTables={{ checkedTables }}</p> -->
		<button @click="multiMode.start()">始</button>
		<button @click="multiMode.save()">存</button>
		<button>改</button>
		<button @click="multiMode.restart()">重開</button>
		<button @click="recite.finalFilter()">比例</button>
		<button @click="multiMode.sortByRmb()">憶序</button>
		<button @click="multiMode.sortBylastRvwDate()">期序</button>
		<button @click="switchRandomImg()">開圖</button>
		<button @click="multiMode.showNextRandomBg()">換圖</button>
		
		
		<!-- 坑{v-model與value=""不兼容} -->
		<span>
			<input type="text" v-model="debuffNumerator" id="debuffNumerator">
			<!-- <input type="text" v-model="tempShape"><button @click="search(tempShape)">尋</button> -->
		</span>
		<span>
			<!-- <input type="text" v-model="multiMode.paging.value" id="paging"> -->
			<input type="text" id="paging" :value="LS.items.multiModePaging.get()">
		</span>
		<button @click="set_page()">設頁</button>
		<span>{{ isSaved? '':'未保存' }}</span>
	</div>
</template>
<!-- <坑>{若欲父組件ʸ子組件ᵗ樣式ˇ設、則子組件須有唯一根節點。} -->
<style scoped>
input{
	background: transparent;
	width: 64px;
	font-size: 12px; /* 最小只能調到12 */
	overflow: visible; /* 允许文本超出边框 不效 */
}
#paging{
	width: 32px;
}
button{
	height: 16px;
	font-size: 13px;
	padding: 0px;
}
</style>