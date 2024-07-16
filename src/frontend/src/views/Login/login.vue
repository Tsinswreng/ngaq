<script setup lang="ts">
import { ref } from 'vue';
//import Login from './LoginOld';
//const login = Login.getInstance()
import {LoginUi} from './LoginUi'
const loginUi = LoginUi.inst
const username = ref('')
const password = ref('')
function submitLogin(){
	//console.log({username:username.value, password:password.value})
	loginUi.Login(username.value, password.value)
	.then()
	.catch(e=>console.error(e))
}

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
			</div>
		</form>
		Do not have an account? <a href="/SignUp">sign up</a>.
	</div>
</template>


<style scoped lang="scss">

.login {
	max-width: 400px;
	margin: 50px auto;
	padding: 20px;
	//background: #f7f7f7;
	//border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login h2 {
	margin-bottom: 20px;
	font-size: 24px;
	text-align: center;
	//color: #333;
}

.login form {
	display: flex;
	flex-direction: column;
}

.login form div {
	margin-bottom: 15px;
}

.login label {
	margin-bottom: 5px;
	font-weight: bold;
	//color: #555;
}

.login input[type="text"],
.login input[type="password"] {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	//border-radius: 4px;
	box-sizing: border-box;
	transition: border-color 0.3s;
}

.login input[type="text"]:focus,
.login input[type="password"]:focus {
	border-color: #3b82f6;
	outline: none;
}

.login button[type="submit"] {
	padding: 10px;
	background: #3b82f6;
	color: white;
	border: none;
	//border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.login button[type="submit"]:hover {
	background: #2563eb;
}

.signup-link {
	text-align: center;
	margin-top: 10px;
	color: #555;
}

.signup-link a {
	color: #3b82f6;
	text-decoration: none;
	transition: color 0.3s;
}

.signup-link a:hover {
	color: #2563eb;
}
</style>

<!-- 
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
	 -->