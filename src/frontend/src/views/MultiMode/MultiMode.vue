<script setup lang="ts">
//import { ref, defineProps, withContext } from 'vue';
import WordCard from '@views/MultiMode/cpnt/WordCard.vue'
import WordInfo from './cpnt/WordInfo.vue';
import MultiMode from './MultiMode';
import Recite from '@ts/voca/Recite';
import WordB from '@ts/voca/WordB';
import { $ } from '@shared/Ut';
import { ref,Ref, onMounted, computed } from 'vue';
import VocaClient from '@ts/voca/VocaClient';
import LS from '@ts/LocalStorage';
//const { words } = defineProps(['words']);
const recite = Recite.getInstance();
const multiMode = MultiMode.getInstance()
const isShowWordInfo = multiMode.isShowWordInfo // <坑>{直ᵈ用status.isShowWordInfo有時不效。組件中新聲明一變量甲、使甲受status.isShowWordInfo之值、此組件ʸ用甲㕥代用status.isShowWordInfo 則又可。}
const isShowCardBox = multiMode.isShowCardBox
let page:Ref<number[]> = multiMode.pageNums

//const returnedWord:Pick<WordB, keyof WordB> = returnedWordRef.value //<坑>{ref函數不能代理類中ᵗ私有屬性}

// onMounted(() => {
// 	start()
// }),

// const isAddTimeGeq3 = computed((wb:WordB)=>{
// 	return wb.fw.times_add >= 3
// })

// 定義一個函數來處理按下 alt+s 的事件
function handleAltS(event: KeyboardEvent) {
	// 檢查按下的按鍵是否是 alt+s
	if (event.altKey && event.key === 's') {
		// 在這裡執行你想要執行的功能
		//console.log('Alt+S pressed!'); // 這裡示範將事件輸出到控制台
		multiMode.save().then((d)=>{
			multiMode.restart()
		})
	}
}

//const element = $( document.getElementById("body") , 'no body')

document.addEventListener("mousedown", (event) => {
	if (event.button === 1) { //鼠標中鍵
		event.preventDefault();
		multiMode.save().then((d)=>{
			multiMode.restart()
		})
	}
});

// 監聽頁面的鍵盤事件
document.addEventListener('keydown', handleAltS);

</script>

<template>
<div class="MultiMode">

		<!-- <button @click="start()">開始</button> -->
	<!-- <h2>{{ 'status.isShowWordInfo='+status.isShowWordInfo.value+' status.isShowCardBox='+status.isShowCardBox.value }}</h2> -->

	<!-- <component :is="CtrlPanel" class="CtrlPanel" v-if="true"></component> -->

	<div class="WordInfo-container">
		<component :is="WordInfo" :wordB="multiMode.curWord" class="WordInfo" :key="multiMode.curWord.fw.id" v-if="isShowWordInfo"></component>
	</div>
	<!-- <component :is="WordWindow" v-if="isShowWordWindow" :wordData="returnedWord" @wordWindow_click="wordWindow_click"></component> -->
	<div class="cards-box" v-if="isShowCardBox" :key="multiMode.multiMode_key.value">.slice(page[0], page[1])
		baseUrl:&nbsp;{{ VocaClient.baseUrl}}&nbsp;,範圍:
		<div v-for="(e, i) in recite.allWordsToLearn.slice(page[0], page[1])">
			<component 
				:is="WordCard" 
				:key="e.fw.table+''+e.fw.id" 
				:wordB="e" 
				:loopIndex="i" 
				@WordCardClick="multiMode.wordCardClick(e)" 
				class="WordCard" 
			/>
		</div>
	</div>
	<img src="" alt="" :class="multiMode.class_bg.value" :id="multiMode.id_bg.value">
	<img src="" alt="" :class="multiMode.class_bg_next.value" :id="multiMode.id_bg_next.value">
	<!-- <img src="../../assets/uys.jpg" alt="" class="bg">
	<img src="../../assets/dfq.jpg" alt="" class="bg"> -->
</div>
</template>

<style scoped lang="scss">


input{
	background: transparent;
	width: 64px;
}
.WordInfo-container{
	width: 30%;
	/* overflow-y: scroll; */
	/* outline: 1px gray; */
	/* border: solid 1px red; */
}
.MultiMode{
	display: flex;
}


.cards-box{
	/* border: solid 1px red; */
	/* margin: 0 30% 0 auto; */
	width: 550px;
	/* position: fixed; */
	/* left: 30%; */
}

/* .WordCard:hover{
	outline: white 1px;
	border: red;
} */

.WordInfo{
	/* display: inline-block; */
	width: 25%;
	height: 90%;
	/* float: right;; */
	position: fixed;
	/* overflow: auto; 创建滚动条 */
	overflow: scroll;
	left: 5%
}

.bg{
	position: fixed;
	margin: 0;
	/* width: 100%; */
	height: 100%;
	width: auto;
	/* height: auto; */
	right: 0;
	background: transparent;
	z-index: -1;
	filter: brightness(0.65);
}

.bg:hover{
	filter: brightness(1);
}

.bg_next{
	position: fixed;
	left: 0;
	width: 1px;
	/* width: 1px;
	height: 1px; */
}

/* @media (min-aspect-ratio: 1/1) {
  .bg, .bg:hover {
    width: 100%;
    height: auto;
  }
} */

</style>

component：这是 Vue 提供的内置组件，用于渲染其他组件或模板。它允许你根据特定条件或数据动态地选择要渲染的组件。

	:is="WordCard"：这是 component 组件的 is 属性，它用于指定要渲染的组件类型。在这里，它指定要渲染的组件类型为 WordCard，即将渲染一个名为 WordCard 的组件。
	
	:wordData="e"：这是传递给动态组件的一个属性。属性的名称是 wordData，而它的值是当前循环中的 e 变量的值。在每次循环中，e 包含了一个单词的数据。通过这个属性，父组件可以将数据传递给被动态渲染的 WordCard 子组件。


	<!--
		@childClick="handleChildClick" 是一个Vue模板中的事件监听器，它的作用是在特定事件触发时调用组件实例中定义的方法。让我们详细解释这个表达式的各个部分：

@ 符号：@ 是Vue中的一个缩写，用于绑定事件监听器。

childClick：这是事件的名称，它是您在子组件中使用 $emit 方法触发的自定义事件的名称。在前面的示例中，我们在子组件中使用 emits('childClick', dataToSend) 来触发了一个名为 childClick 的自定义事件。

= 符号：这个等号表示将事件监听器与某个方法或表达式关联起来。

"handleChildClick"：这是在父组件中定义的一个方法的名称。这个方法会在事件触发时被调用。在前面的示例中，我们在父组件的 <script setup> 部分定义了 handleChildClick 方法。
	  -->./Status