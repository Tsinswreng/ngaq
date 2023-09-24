<script setup lang="ts">
import Manage from './Manage'
import {ref} from 'vue'
const manage = Manage.getInstance()
const tip = 
`
添單詞之格式:
//tableName替換成你實際的表名、如果沒有表則應先新建。
<config>
{
	tableName: 'english' 
}
</config>




`
const tipRef = ref(tip)

</script>

<template>
	<div>
		<button @click="manage.addInDb()">添新詞</button>
		<textarea name="" :id="Manage.id_wordSrcStr" cols="30" rows="10"></textarea>
		<button @click="manage.backupAllTables()">備份所有表</button>
		<button @click="manage.creatTable()">新建表</button>
		<input type="text" :id="Manage.id_neoTableName">
		<div class="tip">
			{{ tipRef }}
		</div>
	</div>
</template>

<style scoped>
.tip{
	white-space: pre-wrap;
}
</style>