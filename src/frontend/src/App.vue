<script setup lang="ts">
import Menu from "./components/Menu.vue";
function test(){
	console.log(
		parseInt(
			'123'
		)
	)
}
</script>



<template>
	<Menu/>
	<router-view></router-view>
<!-- 	<br><br><br><br><br>
	<button onclick="test()">test</button>
	<br>
	<button @click="test()">test2</button> -->
</template>

