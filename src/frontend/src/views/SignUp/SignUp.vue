<script setup lang="ts">
import { ref } from 'vue';
//import Login from './LoginOld';
//const login = Login.getInstance()
import { SignUp } from './SignUp';
const username = ref('')
const password = ref('')
const confirm_password = ref('')
function submitLogin(){
	//console.log({username:username.value, password:password.value})
	if(password.value!== confirm_password.value){
		alert('Passwords do not match')
		return -1
	}
	if(password.value.trim() === ""){
		alert('Password cannot be empty')
		return -1
	}
	SignUp.getInst().SignUp(username.value, password.value)
	.then(d=>{
		alert('Account created successfully')
		window.location.href = '/login'
	})


}

</script>
<template>
	<div class="SignUp">
		<h2>Sign Up</h2>
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
				<label for="password">Confirm Password:</label>
				<input type="password" id="confirm_password" v-model="confirm_password" required>
			</div>

			<div>
				<button type="submit">Sign Up</button>
			</div>
		</form>
		
	</div>
</template>


<style scoped lang="scss">

.SignUp {
	max-width: 400px;
	margin: 50px auto;
	padding: 20px;
	//background: #f7f7f7;
	//border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.SignUp h2 {
	margin-bottom: 20px;
	font-size: 24px;
	text-align: center;
	//color: #333;
}

.SignUp form {
	display: flex;
	flex-direction: column;
}

.SignUp form div {
	margin-bottom: 15px;
}

.SignUp label {
	margin-bottom: 5px;
	font-weight: bold;
	//color: #555;
}

.SignUp input[type="text"],
.SignUp input[type="password"] {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	//border-radius: 4px;
	box-sizing: border-box;
	transition: border-color 0.3s;
}

.SignUp input[type="text"]:focus,
.SignUp input[type="password"]:focus {
	border-color: #3b82f6;
	outline: none;
}

.SignUp button[type="submit"] {
	padding: 10px;
	//background: #3b82f6;
	background: darkcyan;
	color: white;
	border: none;
	//border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.SignUp button[type="submit"]:hover {
//	background: #2563eb;
	background: green;
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