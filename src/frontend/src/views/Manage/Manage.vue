<script setup lang="ts">
import VocaClient, { LsItemNames } from '@ts/voca/VocaClient';
import Manage from './Manage'
import {ref} from 'vue'
import { lsItems } from '@ts/localStorage/Items';
const manage = Manage.getInstance()

const tip = 
`
<config>{tableName:'english'}</config>
`
const tipRef = ref(tip)
const baseUrlRef = ref(VocaClient.baseUrl)

function lsGet(key:string){
	return localStorage.getItem(key)
}

</script>

<template>
	<div>
		<button @click="manage.set_baseUrl()">改baseUrl</button>
		<input type="text" :id="Manage.id_inputBaseUrl" :value="VocaClient.baseUrl">
	</div>
	<div>
		<button @click="manage.addInDb()">添新詞</button>
		<textarea name="" :id="Manage.id_wordSrcStr" cols="30" rows="10"></textarea>
		<button @click="manage.backupAllTables()">備份所有表</button>
		<div>
			<button @click="manage.creatTable()">新建表</button>
			<input type="text" :id="Manage.id_neoTableName">
		</div>
		<div>
			<button>sql注入</button>
			<input type="text" :id="Manage.id_sqlInsert">
		</div>
		<div>
			<button @click="manage.testWriteLocalStorage()">設路徑</button>
			<input type="text" :id="Manage.id_dbPath">
			<button @click="manage.testReadLocalStorage()">讀路徑</button>
		</div>
		<div>
			<button @click="manage.set_PriorityClass()">設權重算法</button>
			<textarea cols="30" rows="10" :id="Manage.id_wordPriorityAlgorithm" :value="lsGet(LsItemNames.priorityAlgorithmTs)??''"></textarea>
		</div>
	</div>
</template>

<style scoped>
.tip{
	white-space: pre-wrap;
}
textarea{
	height: 20px;
}
</style>