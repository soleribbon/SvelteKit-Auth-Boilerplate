<script>
	import { applyAction, enhance } from '$app/forms';

	export let form;
	let loadingForEmail = false;
	let loadingForGoogle = false;
	let error = '';

	async function handleSubmit(event, loginType) {
		if (loginType === 'email') {
			loadingForEmail = true;
		} else if (loginType === 'google') {
			loadingForGoogle = true;
		}

		return async ({ result }) => {
			await applyAction(result);
			console.log('Signup: ' + result.type);

			if (result.type == 'failure') {
				console.log('Error:', result.data);
				error = result.data.error || result.data.signUp.error || 'Unknown Error';
				error = error; // Force reactivity
				// Additional custom error handling
			}
			if (loginType === 'email') {
				loadingForEmail = false;
			} else if (loginType === 'google') {
				// loadingGoogle = false;
				// ABOVE IS COMMENTED BECAUSE THE LOADING INDICATOR DOESNT APPEAR FOR LONG ENOUGH
			}
		};
	}

	let password = '';
	let passwordConfirm = '';
	let passwordMatch = true;
	let moreThanSixChars = true;

	let passwordFieldTouched = false;
	let confirmFieldTouched = false;
	let emailFieldTouched = false;

	$: passwordMatch = password === passwordConfirm;
	$: moreThanSixChars = password.length > 5;

	let show = false;

	function toggleShow() {
		show = !show;
		const inputElement = document.getElementById('password');
		inputElement.type = show ? 'text' : 'password';
	}
</script>

<section class="columns mt-2 sm:pt-10">
	<div class="column is-two-fifths mx-auto rounded-lg bg-white sm:p-10 lg:shadow-xl">
		<h1 class="title">Create your account</h1>
		{#if form?.error}
			<div class="notification is-danger is-light block text-black">{form.error}</div>
		{/if}
		{#if form?.message}
			<div class="notification is-success is-light block text-black">{form.message}</div>
		{/if}

		<form
			action="?/signup-with-email"
			method="post"
			use:enhance={() => handleSubmit(event, 'email')}
		>
			<div class="field">
				<label for="email" class="label">Email</label>
				<p class="control">
					<input
						id="email"
						name="email"
						value={form?.values?.email ?? ''}
						on:input={() => (emailFieldTouched = true)}
						class="input"
						type="email"
						placeholder="Email"
						autocomplete="username"
						required
					/>
				</p>
			</div>

			{#if emailFieldTouched}
				<div class="field">
					<div class="flex justify-between">
						<label for="password" class="label">Password</label>

						<button
							type="button"
							class="text-sm hover:underline active:text-black {passwordFieldTouched
								? ''
								: 'hidden'}"
							on:click={toggleShow}
							aria-label="Toggle password visibility"
						>
							<!-- <i class={show ? 'fas fa-eye-slash' : 'fas fa-eye'}></i> -->
							{show ? 'Hide' : 'Show'}
						</button>
					</div>
					<p class="control">
						<input
							id="password"
							name="password"
							bind:value={password}
							on:input={() => (passwordFieldTouched = true)}
							class="input {moreThanSixChars || !passwordFieldTouched ? '' : 'is-danger'}"
							type="password"
							placeholder="Password"
							autocomplete="new-password"
							required
						/>
					</p>

					{#if !moreThanSixChars && passwordFieldTouched}
						<p class="help is-danger">Password must be more than 5 characters.</p>
					{/if}
				</div>
			{/if}

			{#if moreThanSixChars}
				<div class="field">
					<label for="password_confirm" class="label">Confirm Password</label>
					<p class="control">
						<input
							id="password_confirm"
							name="password_confirm"
							bind:value={passwordConfirm}
							on:input={() => (confirmFieldTouched = true)}
							class="input {passwordMatch || !confirmFieldTouched ? '' : 'is-danger'}"
							type="password"
							placeholder="Confirm Password"
							autocomplete="new-password"
							required
						/>
					</p>
					{#if !passwordMatch && confirmFieldTouched}
						<p class="help is-danger">Passwords don't match.</p>
					{/if}
				</div>
			{/if}

			<div class="field">
				<p class="control">
					<button
						disabled={loadingForEmail || !passwordMatch || !moreThanSixChars}
						class="{loadingForEmail
							? 'is-loading'
							: ''} button is-fullwidth is-link transform transition duration-100 active:scale-105"
						>Sign up</button
					>
				</p>
			</div>
		</form>
		<div class="mb-2 mt-2 flex items-center justify-center">
			<div class="h-0.5 w-full bg-gray-100"></div>
			<p class="mx-2">or</p>
			<div class="h-0.5 w-full bg-gray-100"></div>
		</div>
		<form
			class="mb-4"
			action="?/signup-with-oauth"
			method="post"
			use:enhance={() => handleSubmit(event, 'google')}
		>
			<!-- <button
				class="button transform transition duration-100 active:scale-105"
				name="provider"
				value="github"
				type="submit">GitHub</button
			> -->

			<button
				class="{loadingForGoogle
					? 'is-loading'
					: ''} button is-secondary inline-flex w-full transform items-center text-center text-black transition duration-100 active:scale-105"
				name="provider"
				value="google"
				type="submit"
				disabled={loadingForGoogle}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 inline h-5 w-5 fill-current text-gray-900"
					data-icon="google"
					aria-hidden="true"
					role="img"
					focusable="false"
					data-prefix="fab"
					viewBox="0 0 48 48"
					><path
						fill="#fbc02d"
						d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
					></path><path
						fill="#e53935"
						d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
					></path><path
						fill="#4caf50"
						d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
					></path><path
						fill="#1565c0"
						d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
					></path></svg
				>
				Sign up with Google
			</button>
		</form>

		<div class="mt-6">
			<p class="has-text-centered">
				Already have an account? <a class="font-bold hover:underline" href="/">Sign in</a>
			</p>
		</div>
	</div>
</section>
