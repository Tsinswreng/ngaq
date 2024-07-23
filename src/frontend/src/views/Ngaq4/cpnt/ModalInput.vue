<template>
	<div v-if="isVisible" class="modal">
		<div class="modal-content">
			<textarea v-model="inputValue" class="input-box" placeholder="Enter text..." />
			<button @click="hideModal">Close</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// 控制输入框的显示
const isVisible = ref(false);

// 输入框的值
const inputValue = ref('');

// 显示输入框的函数
const showModal = () => {
	isVisible.value = true;
};

// 隐藏输入框的函数
const hideModal = () => {
	isVisible.value = false;
};

// 组件挂载时显示输入框
onMounted(() => {
	showModal();
});
</script>

<style scoped lang="scss">
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	//background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-content {
	//background: white;
	padding: 20px;
	//border-radius: 8px;
	text-align: center;
	width: 400px;
	border: 1px solid #ccc;
}

.input-box {
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	//border-radius: 4px;
}

button {
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
}
</style>
  