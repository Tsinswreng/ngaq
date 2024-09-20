<script setup lang="ts">
import Menu from "./components/Menu.vue";
import MyComponent from "./tsx/MyComponent";
</script>



<template>
	<!-- <MyComponent :message="'11'"/> -->
	<Menu/>
	<router-view></router-view>
<!-- 	<br><br><br><br><br>
	<button onclick="test()">test</button>
	<br>
	<button @click="test()">test2</button> -->
</template>

