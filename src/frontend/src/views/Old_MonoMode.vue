<script lang="ts">

import {MainB} from "../ts/mainB";
export default {
	data(){
		return{
			mainB: new MainB()
		}

	}
}

</script>

<template>
<!--	<h1>{{ mainB }}</h1>-->
<!--	<button onclick="toggleSidebar()" class="toggleButton">+</button>-->
<!--	<div id="leftSideBar" class="leftSideBar" >這は是れ一個左側邊欄なり-->
<!--		<button onclick="console.log(reviewed);">看今回既學ᵗ詞</button>-->
<!--		<br>-->
<!--		<button onclick="mainB.originUi.reviewForgottenWords()">複習此次所忘</button>(請先手動點擊保存)-->
<!--		<br>-->
<!--		<a href="multiWordMode.html" target="_blank">多詞模式</a>-->
<!--		<br>-->
<!--		<input type="text" placeholder="id" id="跳轉"><button>跳轉</button>-->
<!--	</div>-->
	<div>v23.04.11-2016</div>
	A Tsinswreng Gwāng fābricātus est
	<!--Ab Tsinswreng Gwāng-ō creātus est-->
	<div>請選擇語言:<nobr>
		<label for="eng">英:<input type="radio" name="ling" id="eng" value="eng"></label>
		<label for="jap">日:<input type="radio" name="ling" id="jap" value="jap"></label>
		<label for="lat">拉:<input type="radio" name="ling" id="lat" value="lat"></label>
		<button @click="mainB.assignWordsFromServ();">發GET請求</button>
		<button @click="mainB.originUi.startToShow()">始</button>
		<!-- <input type="text" id="tempPwd" name="tempPwd"> -->
		<input type="text" id="max_randomBonus" value="0">
		<input type="text" id="debuffNumerator" value="3600*24*14">
		<!-- <button onclick="originUi.addRandomBonus()">addBonus</button> -->
	</nobr>
	</div>
	<div id="curWordInfo">curWordInfo
		<table>
			<tr>
				<td>詞形</td>
				<td id="wordShape"></td>
			</tr>
			<tr>
				<td>id</td>
				<td id="wordId"></td>
			</tr>
			<tr>
				<td>語言</td>
				<td id="ling"></td>
			</tr>
			<tr>
				<td>事件</td>
				<td id="wordEvent"></td>
			</tr>
			<tr>
				<td>權重</td>
				<td id="priority"></td>
			</tr>
			<tr>
				<td>添ᵗ期</td>
				<td id="addedDates"></td>
			</tr>
			<tr>
				<td>添ᵗ次</td>
				<td id="addedTimes"></td>
			</tr>
			<tr>
				<td>記ᵗ期</td>
				<td id="rememberedDates"></td>
			</tr>
			<tr>
				<td>記ᵗ次</td>
				<td id="rememberedTimes"></td>
			</tr>
			<tr>
				<td>忘ᵗ期</td>
				<td id="forgottenDates"></td>
			</tr>
			<tr>
				<td>忘ᵗ次</td>
				<td id="forgottenTimes"></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
			</tr>
		</table>
	</div>

	<!--此の單語を覺えて居るか?--><br>

	<div id="yesOrNoBtnContainer">


		<button class="ctrlBtn" @click="mainB.originUi.reviewForgottenWords()">複習此輪所忘</button>
		<button class="ctrlBtn" @click="mainB.vocaB.saveToServ()">保存</button>
		<br>
		<button class="score" id="score" @click="mainB.toggle_curWordInfo();mainB.toggle_lastWordInfoCtainer()"></button>
		<br>
		<!--<button onclick="testPostBtn()">post</button>
		<button onclick="testGetDataBtn()">get</button>
		<button onclick="vocaB.testAjax(JSON.stringify(vocaB.allWords[0]))">testAjax</button>
		<button onclick="vocaB.testAxios(JSON.stringify(vocaB.allWords))">testAxios</button>-->
	</div>
	<button class="yesOrNo" @click="mainB.originUi.showNext(()=>{})">跳過</button>
	<br>
	<button class="yesOrNo" @click="mainB.originUi.showNext(mainB.vocaB.fgtEvent/* .bind(vocaB) */)">不記得</button>
	<br>

	<button class="yesOrNo" @click="mainB.originUi.showNext(mainB.vocaB.rmbEvent/* .bind(vocaB) */)">記得</button>
	<br>
	<br>
	<button id="word" @click="mainB.originUi.showWordInfoAtBottom()">&lt;div id="word"&gt;乜都冇有&lt;/div&gt;</button>
	<br>
	上一個: <br>
	<div id="lastWordInfo">

	</div>
	<div id="lastWordInfoCtainer">

		<table id="last_wordInfoTable">
			<tr>
				<td>詞形</td>
				<td id="last_wordShape"></td>
			</tr>
			<tr>
				<td>id</td>
				<td id="last_wordId"></td>
			</tr>
			<tr>
				<td>語言</td>
				<td id="last_ling"></td>
			</tr>
			<tr>
				<td>事件</td>
				<td id="last_wordEvent"></td>
			</tr>
			<tr>
				<td>權重</td>
				<td id="last_priority"></td>
			</tr>
			<tr>
				<td>添ᵗ期</td>
				<td id="last_addedDates"></td>
			</tr>
			<tr>
				<td>添ᵗ次</td>
				<td id="last_addedTimes"></td>
			</tr>
			<tr>
				<td>記ᵗ期</td>
				<td id="last_rememberedDates"></td>
			</tr>
			<tr>
				<td>記ᵗ次</td>
				<td id="last_rememberedTimes"></td>
			</tr>
			<tr>
				<td>忘ᵗ期</td>
				<td id="last_forgottenDates"></td>
			</tr>
			<tr>
				<td>忘ᵗ次</td>
				<td id="last_forgottenTimes"></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
			</tr>
		</table>
	</div>


</template>

<style scoped>
body{
	background-color: black;
	color: white;
	/*background-image: url("C:/Users/lenovo/Pictures/屏保/當前壁紙/aeAvq2.jpg");*/
}
button{
	background-color: black;
	color: white;
}
input[type="radio"] {
	/*transform: scale(1.5);*/ /*不知胡加此後則複選框會突破側邊欄ᵗ覆*/
}
#word{
	font-size: 50px;
	/*border: white solid 1px;*/
	white-space: pre;
	background-color: black;
	color: white;
	font-family: "孤鹜 筑紫明朝";
	/*width: 500px;*/
}
#curWordInfo{
	/*请注意，float 属性有可能会引起其他元素的位置出现异常。为了避免这种情况，你可以在容器元素上添加 overflow: auto; 属性，这样容器元素就会自动适应内部元素的高度，并且不会出现位置异常的问题。*/
	float: right;
	border: white solid 1px;
	white-space: pre;
	font-size: 14px;
	display: none;
}
#lastWordInfo{
	font-size: 14px;
	/*border: white solid 1px;*/
	white-space: pre;
}

#lastWordInfoCtainer{
	font-size: 14px;
	/*border: white solid 1px;*/
	white-space: pre;
	display: none;
}
#last_wordInfoTable{
	float: right;
	border: white solid 1px;
}
.ctrlBtn{
	width: 125px;
	height: 25px;
	font-size: 16px;
	background: transparent;
	color: white;
	border: white solid 1px;
}
.score{
	width: 250px;
	height: 25px;
	font-size: 16px;
	background: transparent;
	color: white;
	border: none;
}
.yesOrNo:hover, .ctrlBtn:hover ,.score:hover{
	border: white solid 3px;
}
.yesOrNo:active, .ctrlBtn:active, .score:active {
	background-color: white;
	color: black;
}
.yesOrNo{
	width: 250px;
	height: 50px;
	font-size: 32px;
	background: transparent;
	/*background: black;*/
	/*color: white;*/
	border: white solid 1px;
}
#leftSideBar, .leftSideBar{
	position: fixed;
	top: 20px;
	/*left: -200px; !* 菜单初始状态为隐藏 *!*/
	width: 200px;
	height: 100%;
	display: none;
	background: rgb(32, 33, 36);
	/*transition: left 0.3s ease-in-out; !* 设置过渡动画效果 *!*/
}

.toggleButton{
	position: fixed;
	top: 5px;
	left: 5px;
	padding: 5px;
	width: 10px;
	height: 10px;
	border: none;
	cursor: pointer;
	transform: scale(1.5);
}
.sidebar.visible {
	left: 0px;
}

a{
	color: white;
}
/*
button.wordsList{
	font-family: "孤鹜 筑紫明朝";
	font-size: 20px;
}*/


</style>