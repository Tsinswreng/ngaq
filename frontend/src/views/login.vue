<template>
	<div class="login">
		<h2>Login</h2>
		<form @submit.prevent="login">
		<div>
			<label for="username">Username:</label>
			<input type="text" id="username" v-model="username" required>
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" v-model="password" required>
		</div>
		<div>
			<button type="submit">Login</button>
		</div>
		</form>
	</div>
	</template>
	
<script>
export default {
	data() {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		login() {
			// 执行登录逻辑，例如向服务器发送登录请求
			console.log('Username:', this.username);
			console.log('Password:', this.password);

			// 重置表单
			this.username = '';
			this.password = '';
		}
	}
};
</script>
	
<style>
.login {
	max-width: 300px;
	margin: auto;
}

h2 {
	text-align: center;
}

form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

label {
	font-weight: bold;
}

input {
	padding: 5px;
}

button {
	padding: 10px;
}
</style>
	