<script setup lang="ts">
import Manage from './Manage'
import {ref} from 'vue'
const manage = Manage.getInstance()
const tip = 
`
<config>{tableName:'english'}</config>
`
const tipRef = ref(tip)

</script>

<template>
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
			<button>設配置</button>
			<textarea name="" id="" cols="30" rows="10"></textarea>
		</div>
		<div class="tip">
			{{ tipRef }}
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