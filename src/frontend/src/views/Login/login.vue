<script setup lang="ts">
import { ref } from 'vue';
import Login from './Login';
const login = Login.getInstance()
const username = ref('')
const password = ref('')
function submitLogin(){
	return login.login({username:username.value, password:password.value})
}
// export default {
// 	data() {
// 		return {
// 			username: '',
// 			password: ''
// 		};
// 	},
// 	methods: {
// 		login() {
// 			// 执行登录逻辑，例如向服务器发送登录请求
// 			console.log('Username:', this.username);
// 			console.log('Password:', this.password);

// 			// 重置表单
// 			this.username = '';
// 			this.password = '';
// 		}
// 	}
// };
</script>
<template>
	<div class="login">
		<h2>Login</h2>
		<form @submit.prevent="submitLogin">
		<!-- <form action="/login" method="post"> -->
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
				<button>tourist</button>
			</div>
		</form>
		Do not have an account? <a href="/SignUp">sign up one</a>.
	</div>
</template>
	

	
<style scoped>
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
	