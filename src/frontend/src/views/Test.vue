<template lang="">
	<div>
		
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';



interface MyType{
	name:string,
	age:number
}

let p1:MyType = {
	name: 'jack',
	age:18
}

let r1 = ref<MyType>(p1)
let p2:MyType = r1.value

class Cl{
	private foo
	bar
}

class MyClass{
	name:string = ''
	private age:number = 0
	private cl:Cl = new Cl
}

let c1 = new MyClass()
let r2 = ref<MyClass>(c1)
let c2:Pick<MyClass, keyof MyClass> = r2.value

</script>
<style lang="">
	
</style>