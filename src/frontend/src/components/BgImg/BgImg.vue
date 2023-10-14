<template>
	<div class="background-image"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  
  // 定义一个 ref 属性来存储背景图片的 URL
  const backgroundImageUrl = ref('');
  
  // 设置 props 属性，用于接收传递给组件的背景图片 URL
  const props = defineProps({
	imageUrl: String,
  });
  
  // 将传递的背景图片 URL 设置为 ref 属性的值
  backgroundImageUrl.value = props.imageUrl??'';
  
  // 计算属性，用于设置背景图片的样式
  const backgroundImageStyle = computed(() => ({
	backgroundImage: `url(${backgroundImageUrl.value})`,
  }));
  
  // 在组件挂载后设置背景图片样式
onMounted(() => {
	const element = document.querySelector('.background-image');
	if (element) {
	  element.style = backgroundImageStyle.value;
	}
});
</script>

<style scoped>
.background-image {
	width: 100%;
	height: 100%;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>