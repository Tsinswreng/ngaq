<script lang="ts">
	export default{
		data(){
			return {
				test:1
			};
		}
	}
</script>

<template>
	<div class="btn-panel">

		<hr>
		<button class="review-btn">複習</button><button class="save-btn">保存</button>
		<br>
		<button class="status">{{ test }}</button>
		<br>
		<button class="skip-btn">跳過</button>
		<br>
		<button class="rmb-btn">記得</button>
		<br>
		<button class="fgt-btn">不記得</button>
	</div>
	
</template>

<style scoped lang="css">



.btn-panel{
	border: solid white 1px;
	width: 10rem;
	padding: 0px;
	position: fixed;
	margin: 50px 50px 10px 5px;
}

.btn-panel button{
	z-index: 1;
	font-size: 3rem;
	padding: 0;
	width:100%
}

</style>