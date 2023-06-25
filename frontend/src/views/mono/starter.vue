<template>
	<div>請選擇語言:<nobr>
		<label for="eng">英:<input type="radio" name="ling" id="eng" value="eng"></label>
		<label for="jap">日:<input type="radio" name="ling" id="jap" value="jap"></label>
		<label for="lat">拉:<input type="radio" name="ling" id="lat" value="lat"></label>
		<button onclick="assignWordsFromServ();">發GET請求</button>
		<button onclick="originUi.startToShow()">始</button>
		<!-- <input type="text" id="tempPwd" name="tempPwd"> -->
		<input type="text" id="max_randomBonus" value="0">
		<input type="text" id="debuffNumerator" value="3600*24*14">
		<!-- <button onclick="originUi.addRandomBonus()">addBonus</button> -->
	</nobr>
	</div>
</template>


<script lang="ts">
	export default {
		data(){
			return 111;
		}
	}
</script>

<style scoped>

</style>