<script setup lang="ts">
	
</script>

<template>
	<div class="container">
		<h2>Sign Up</h2>
		<table>
			<tr>
				<td>user name</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>password</td>
				<td><input type="password"></td>
			</tr>
			<tr>
				<td>confirm password</td>
				<td><input type="password"></td>
			</tr>
			<tr>
				<td>email</td>
				<td><input type="password"></td>
			</tr>
			<tr>
				<td>verification code</td>
				<td><input type="password"></td>
			</tr>
		</table>
		<button>get verification code</button>
		<button>sign up</button>
		<p>already have an account? <a href="/login">log in</a></p>
	</div>
</template>

<style scoped>
.container{
	/* display: flex;
	flex-direction: column;
	gap: 10px; */
	margin: auto;
	max-width: 300px;
}

input{
	background: transparent;
}
</style>