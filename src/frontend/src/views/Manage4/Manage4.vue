<script setup lang="ts">
import { ref, Ref } from 'vue';
import {Manage4} from "./Manage4.ts"
import WordInfo from "../Ngaq4/cpnt/WordInfo.vue"
import {JoinedWord} from "@shared/model/word/JoinedWord"
const manage = Manage4.getInst()
const searchWord = ref('');
const joinedWord:Ref<JoinedWord|undef> = ref()
async function Search(){
	// console.log(manage)
	// console.log(Object.keys(manage))
	const word = await manage.SeekWordByText(searchWord.value)
	joinedWord.value = word[0]
}

// function makeAllChildrenEditable(parentElement) {
//   const children = parentElement.querySelectorAll('*'); // 选择所有子元素
//   children.forEach(child => {
//     child.contentEditable = 'true';
//   });
// }
// makeAllChildrenEditable(document.body);

</script>

<template>

<div class="container">
	search word by text:<br>
	<input type="text" v-model="searchWord">
	<button @click="Search">go</button>
	<button @click="Search">del</button>
	<button @click="Search">save</button>

	<div>
		<span>id:</span>
		<span>{{joinedWord?.textWord?.id}}</span><hr>
		<div style="font-size: 200%;">{{joinedWord?.textWord?.text}}</div>
		<hr>
	
		<span id="mean" class="editable" contenteditable="true">{{ joinedWord?.propertys[0]?.text }}</span>
		<!-- <div v-for="(prop,i) in joinedWord?.propertys">
			<span>{{prop.belong}}</span>
			<hr>
			<span>{{prop.text}}</span>
			<hr>
		</div> -->

	</div>

</div>




</template>


<style scoped lang="scss">


.container{
	margin-left: 5%;

}
input{
	width: 10%;
	//padding: 10px;
	border: 1px solid #ddd;
	//border-radius: 4px;
	box-sizing: border-box;
	transition: border-color 0.3s;
}

input[type="text"]:focus{
	border-color: #3b82f6;
	outline: none;
}

button{
	height: 5%;
	font-size: 16px;
	padding: 1px;
	background-color: darkcyan;
	border: 0px;
	width: 5%;
	margin-left: 1%;
}

button:hover{
	background-color:green;
}

button:active{
	background-color: white;
	color: black;
}
</style>