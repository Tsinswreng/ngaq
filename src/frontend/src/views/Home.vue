<template>
	<Welcome/>
	<About/>
</template>

<script>
import Welcome from "../components/Welcome.vue";
import About from "../components/About.vue";

export default {
	name: "Home.vue",
	components: {About, Welcome}
}

</script>

<style scoped>

</style>