<!-- 控制板、含諸按鈕等 -->
<script setup lang="ts">
//import {ref} from 'vue'
import Log from '@shared/Log';
import {WebNgaqUi} from '../WebNgaqUi';
import Recite from '@ts/voca/Recite';
import {ref, onBeforeMount} from 'vue'
import LS from '@ts/LocalStorage';


let ui:WebNgaqUi
let loaded = ref(false)
onBeforeMount(async()=>{
	ui = await WebNgaqUi.getInstanceAsync()
	loaded.value = true
})
//const ui = await WebVocaUi.getInstanceAsync()
//console.log(ui)
// const isSaved = ui.uiStatus.isSaved
// const debuffNumerator = ui.uiStatus.debuffNumerator_str

// function switchRandomImg(){
// 	ui.uiStuff.lockBg.value = !ui.uiStuff.lockBg.value
// }

function set_page(){
	const ele = document.getElementById('paging') as HTMLInputElement
	const value = ele.value
	ui.set_page(value)
	ui.uiStuff.cardsBox_key.value++
}
</script>

<template>
	<div v-if="loaded">
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
		<!-- <button @click="ui.mkWordBox()">showWordBox</button>
		<button @click="ui.rmWordBox()">hide</button> -->
		<button @click="ui.prepareEtStart()">始</button>
		<button @click="ui.save()">存</button>
		<button>改</button>
		<button @click="ui.restart()">重開</button>
		<button @click="ui.uiStuff.lockBg.value = !ui.uiStuff.lockBg.value">
			{{ ui.uiStuff.lockBg.value==true?
				'改景'
				:'定景'
			}}
		</button>
		<!-- <button @click="recite.finalFilter()">比例</button> -->
		<!-- <button @click="ui.sortByRmb()">憶序</button>
		<button @click="ui.sortBylastRvwDate()">期序</button> -->
		<!-- <button @click="switchRandomImg()">開圖</button>
		<button @click="ui.showNextRandomBg()">換圖</button> -->
		
		
		<!-- 坑{v-model與value=""不兼容} -->
		<span>
			<!-- <input type="text" v-model="debuffNumerator" id="debuffNumerator"> -->
			<!-- <input type="text" v-model="tempShape"><button @click="search(tempShape)">尋</button> -->
		</span>
		<span>
			<!-- <input type="text" v-model="multiMode.paging.value" id="paging"> -->
			<input type="text" id="paging" :value="LS.items.multiModePaging.get()">
		</span>
		<button @click="set_page()">設頁</button>
		<!-- <span>{{ isSaved? '':'未保存' }}</span> -->
	</div>
</template>
<!-- <坑>{若欲父組件ʸ子組件ᵗ樣式ˇ設、則子組件須有唯一根節點。} -->
<style scoped lang="scss">
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
	height: 5%;
	font-size: 16px;
	padding: 1px;
	background-color: black;
	border: 1px;
}

button:hover{
	background-color:darkcyan;
}

button:active{
	background-color: white;
	color: black;
}
</style>../WebNgaqUi../WebNgaqUi