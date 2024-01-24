<script setup lang="ts">
//import SingleWord2 from '@shared/SingleWord2';
import WordB from '@ts/voca/WordB';
import words from '@ts/voca/testCase';
import { ref, Ref } from 'vue';

const props = defineProps<{
	wordData: WordB,
}>()

const fw = props.wordData.fw
const wb = props.wordData

const emits = defineEmits(['wordWindow_click']);

function closeWordWindow(){
	emits('wordWindow_click', false)
}



</script>

<template>
	<div>
	<!-- <transition name="fade" appear> -->
		<div class="dialog-overlay" @click="closeWordWindow">
		  <div class="dialog">
			<h2>{{ fw.wordShape }}</h2>
			<table>
				<tr>
					<td>id</td><td>{{ fw.id }}</td>
				</tr>
				<tr>
					<td>註</td><td>{{ fw.annotation }}</td>
				</tr>
				<tr>
					<td>意</td><td>{{ fw.mean }}</td>
				</tr>
				<tr>
					<td>添ᵗ期</td><td>{{ fw.dates_add }}</td>
				</tr>
				<tr>
					<td>權</td><td>{{ wb.priorityObj }}</td>
				</tr>
				<tr>
					<td>事</td><td></td>
				</tr>

			</table>
			<button @click="closeWordWindow">关闭</button>
		  </div>
		</div>
	<!-- </transition> -->
	</div>
</template>

  <style scoped>
  .dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
  }
  
  .dialog {
	/* background: white; */
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	text-align: center;
  }
  
  .fade-enter-active, .fade-leave-active {
	transition: opacity 0.1s;
  }
  
  .fade-enter, .fade-leave-to /* .fade-leave-active 在版本 2.1.8 中被替换 */ {
	opacity: 0;
  }
  </style>

<!-- <transition> 标签可以包裹任何元素，通常是包裹在你想要添加过渡效果的元素的外部。当包裹的元素被插入或删除时，Vue 会自动触发过渡效果，包括以下几种过渡状态：

	entering: 当元素进入 DOM（即被插入到页面中）时，进入此状态。您可以使用 CSS 过渡类来定义进入时的样式。
	
	entered: 元素进入 DOM 后，进入此状态。通常在 enter 过渡的最后一帧触发。这是应用过渡的最终状态。
	
	leaving: 当元素离开 DOM（即被从页面中移除）时，进入此状态。您可以使用 CSS 过渡类来定义离开时的样式。
	
	left: 元素离开 DOM 后，进入此状态。通常在 leave 过渡的最后一帧触发。这是应用过渡的最终状态。
	
	通过在 <transition> 标签上设置不同的属性，您可以定义不同的过渡效果和持续时间。以下是一些常见的属性：
	
	name: 指定过渡效果的名称，Vue 会自动为进入和离开的元素添加对应的类名，以便您可以定义 CSS 过渡效果。
	
	appear: 指定是否在初始渲染时应用过渡效果。
	
	mode: 定义过渡模式，可以是 "in-out"（新元素先进入，然后旧元素离开）或 "out-in"（旧元素先离开，然后新元素进入）。
	
	enter-class 和 leave-class: 自定义进入和离开状态时要添加的 CSS 类名。
	
	enter-active-class 和 leave-active-class: 自定义进入和离开状态时要添加的活动（动画）CSS 类名。 -->