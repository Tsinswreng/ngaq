<script setup lang="ts">
import Menu from "./components/Menu.vue";
import * as common from "@shared/Common"


const workerCode = `
	throw new Error("Worker err");
	self.onmessage = function(e) {
		console.log('Message received from main script');
		console.log(e, 'e')
		let ans = 0;
		for(let i = 0; i < 1000000000; i++){
			ans+=i
		}
		self.postMessage(ans);
	}
`

const workerUrl = URL.createObjectURL(
	new Blob([workerCode],{ type: "text/javascript" })
)

const worker = new Worker(workerUrl, { type: "module" });

function RunWorker(worker: Worker, args){
	worker.postMessage(args);
	return new Promise((res,rej)=>{
		worker.onmessage = function(event) {
			res(event.data);
		}
	})
}

function startWorker(){
	try {
		console.log('Starting worker');
		worker.postMessage({arg0: 1, arg1: "2"});
		worker.onmessage = function(event) {
			console.log('Result from Worker:', event.data);
		};
	} catch (error) {
		console.error(error, 'caught err from worker');
	}

}


</script>



<template>
	<!-- <MyComponent :message="'11'"/> -->
	<!-- <button @click="startWorker()">Start Worker</button> -->
	<Menu/>
	<router-view></router-view>
<!-- 	<br><br><br><br><br>
	<button onclick="test()">test</button>
	<br>
	<button @click="test()">test2</button> -->
</template>

