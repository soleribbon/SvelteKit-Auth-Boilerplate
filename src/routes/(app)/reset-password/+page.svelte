<script>
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let passwordMatch = true;
	let moreThanSixChars = true;

	let passwordFieldTouched = false;
	let confirmFieldTouched = false;

	let newPassword = '';
	let confirmPassword = '';
	let resetError = '';
	let resetSuccess = '';

	let isLoading = false;

	onMount(() => {
		const urlParams = $page.url.searchParams;
		if (urlParams.has('error')) {
			resetError = urlParams.get('error_description') || 'Unknown Error';
			resetError = decodeURIComponent(resetError.replace(/\+/g, ' '));
			// console.log(resetError);
		}
	});

	async function handleSubmit() {
		isLoading = true;

		return async ({ result }) => {
			await applyAction(result);

			if (result.type == 'failure') {
				console.log('Error:', result.data);
				resetError =
					result.data.error || result.data.sendResetPasswordEmail.error || 'Unknown Error';
				resetError = resetError; // Force reactivity
				// Additional custom error handling
			} else {
				isLoading = false;

				resetSuccess = 'Password reset successfully!';
			}
		};
	}

	$: passwordMatch = newPassword === confirmPassword;
	$: moreThanSixChars = newPassword.length > 5;
</script>

<section class="columns mt-2 sm:pt-10">
	<div class="column is-two-fifths mx-auto rounded-lg sm:p-10 lg:shadow-xl">
		<h1 class="title">Reset Password</h1>
		{#if resetError}
			<div class="notification is-danger is-light py-4 text-black">{resetError}</div>
			<a
				href="/"
				class="button is-link w-full transform py-5 transition-transform duration-100 hover:scale-105"
			>
				Back to login
			</a>
		{:else if resetSuccess}
			<div class="notification is-success is-light py-4 text-black">{resetSuccess}</div>
			<a
				href="/"
				class="button is-link w-full transform py-5 transition-transform duration-100 hover:scale-105"
			>
				Continue
			</a>
		{:else}
			<form method="post" use:enhance={handleSubmit}>
				<div class="field">
					<label for="newPassword" class="label">New Password</label>
					<div class="control">
						<input
							id="newPassword"
							name="newPassword"
							bind:value={newPassword}
							on:input={() => (passwordFieldTouched = true)}
							class="input {moreThanSixChars || !passwordFieldTouched ? '' : 'is-danger'}"
							type="password"
							placeholder="New Password"
							autocomplete="new-password"
							required
						/>
					</div>
					{#if !moreThanSixChars && passwordFieldTouched}
						<p class="help is-danger">Password must be more than 5 characters.</p>
					{/if}
				</div>
				<div class="field">
					<label for="confirmPassword" class="label">Confirm Password</label>
					<div class="control">
						<input
							id="confirmPassword"
							name="confirmPassword"
							bind:value={confirmPassword}
							on:input={() => (confirmFieldTouched = true)}
							class="input {passwordMatch || !confirmFieldTouched ? '' : 'is-danger'}"
							type="password"
							placeholder="Confirm Password"
							autocomplete="new-password"
							required
						/>
						{#if !passwordMatch && confirmFieldTouched}
							<p class="help is-danger">Passwords don't match.</p>
						{/if}
					</div>
				</div>

				<button
					disabled={!passwordMatch || isLoading || !moreThanSixChars}
					class="{isLoading
						? 'is-loading'
						: ''} button is-primary is-fullwidth is-link transform transition duration-100 active:scale-105"
					type="submit">Reset Password</button
				>
			</form>
		{/if}
	</div>
</section>
