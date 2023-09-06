<script setup lang="ts">
import WordCard from '@components/WordCard.vue'
import p from '@ts/voca/testCase'
const { words } = defineProps(['words']);
</script>

<template>
	<div v-for="e in words" class="cards-box">
		<component :is="WordCard" :wordData="e" />
		<!-- <WordCard/> -->
	</div>
	
</template>

<style scoped>
	cards-box{
		border: solid 1px red;
	}
</style>