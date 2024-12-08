<script setup lang="ts">

</script>

<template>

<div class="container">
	search word by text:<br>
	<input type="text"><button>go</button>
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
	width: 3%
}

button:hover{
	background-color:green;
}

button:active{
	background-color: white;
	color: black;
}
</style>