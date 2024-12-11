<script setup lang="ts">
import { ref, Ref } from 'vue';
import {Manage4} from "./Manage4"
import WordInfo from "../Ngaq4/cpnt/WordInfo.vue"
import {JoinedWord} from "@shared/model/word/JoinedWord"
const manage = Manage4.getInst()
const searchWord = ref('');
const joinedWord:Ref<JoinedWord|undef> = ref()
const neoProp = ref('')
async function Search(){
	// console.log(manage)
	// console.log(Object.keys(manage))
	const word = await manage.SeekWordByText(searchWord.value)
	if(word == void 0){return}
	joinedWord.value = word[0]
}


async function Del(){
	const id = joinedWord.value?.textWord?.id
	if(id == void 0){return }
	await manage.Rm_Word(id)
}


async function Save(){
	const prop = joinedWord.value?.propertys[0]
	if(prop == void 0){return}
	// console.log(prop)//t
	// console.log(prop.text)//t
	prop.text = neoProp.value
	await manage.Upd_prop(prop)
}

async function Refresh(){
	manage.reload()
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
	<button @click="Del">del</button>
	<button @click="Save">save</button>
	<button @click="Refresh">🔄</button>

	<div>
		<span>id:</span>
		<span>{{joinedWord?.textWord?.id}}</span><hr>
		<div style="font-size: 200%;">{{joinedWord?.textWord?.text}}</div>
		<hr>
	
		<span id="mean" class="editable" contenteditable="true">{{ joinedWord?.propertys[0]?.text }}</span>
		<br>
		<textarea type="text" id="mead" v-model="neoProp"></textarea>
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

textarea{
	background: transparent;
}

button{
	height: 10%;
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