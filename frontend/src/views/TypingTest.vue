<script lang="ts">
	import {MainB} from "../ts/mainB";
	const mainB = new MainB()

	export default {
		data(){
			return{
				mainB
			}
		}
	}
</script>

<template>
	<button onclick="mainB.assignWordsFromServ()">測試onclick</button>
	<button @click="mainB.assignWordsFromServ()">測試@click</button>
</template>