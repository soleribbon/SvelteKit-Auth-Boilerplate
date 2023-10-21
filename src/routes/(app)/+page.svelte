<script>
	// GO HERE TO CREATE GOOGLE AUTH: https://console.cloud.google.com/apis/credentials/consent

	import { applyAction, enhance, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let isForgotPasswordModalOpen = false;
	let resetEmail = '';
	let resetError = '';
	let resetSuccess = '';
	let magicError = '';
	let magicSuccess = '';
	export let form;

	let emailFieldTouched = false;

	let loadingLogin = false; //for login form
	let loadingGoogle = false;

	let error = '';
	let loadingReset = false; //for send reset link loading

	function handleForgotPassword() {
		isForgotPasswordModalOpen = true;
	}

	async function handleResetPassword(event) {
		loadingReset = true;
		return async ({ result }) => {
			await applyAction(result);
			console.log('Reset: ' + result.type);
			if (result.type == 'failure') {
				console.log('Error:', result.data);
				resetError =
					result.data?.error ??
					result.data?.signinWithPassword?.error ??
					result.data?.sendResetPasswordEmail?.error ??
					'Unknown Error';

				resetError = resetError; // Force reactivity

				// A nicer way of saying it
			}
			if (result.type == 'success' && result.data.sendResetPasswordEmail) {
				resetSuccess = 'Successfuly sent password reset email - please check your inbox!';
				await invalidateAll();
			}
			loadingReset = false;
		};
	}

	// HANDLE LOGIN SUBMIT BUTTON
	async function handleSubmit(event, loginType) {
		if (loginType === 'email') {
			loadingLogin = true;
		} else if (loginType === 'google') {
			loadingGoogle = true;
		}

		return async ({ result }) => {
			await applyAction(result);
			console.log('Login: ' + result.type);
			if (result.type == 'failure') {
				console.log('Error:', result.data);
				error =
					result.data?.error ??
					result.data?.signinWithPassword?.error ??
					result.data?.createMagicLink?.error ??
					'Unknown Error';

				error = error; // Force reactivity

				// A nicer way of saying it
				if (String(error) == 'Invalid credentials.') {
					error = 'Email or password incorrect.';
				}
			}
			if (result.type == 'success' && result.data.createMagicLink) {
				magicSuccess = 'Sent magic link email - please check your inbox!';
			}
			if (loginType === 'email') {
				loadingLogin = false;
			} else if (loginType === 'google') {
				// loadingGoogle = false;
				// ABOVE IS COMMENTED BECAUSE THE LOADING INDICATOR DOESNT APPEAR FOR LONG ENOUGH
			}
		};
	}
</script>

<section class="columns sm:mt-2 sm:pt-10">
	<div class="column is-two-fifths mx-auto rounded-lg sm:p-10 lg:shadow-xl">
		<figure
			class="mt-0 content-center"
			style="max-width: 100%; display: flex; justify-content: center; align-items: center;"
		>
			<img class="door" src="door.svg" alt="Welcome In" style="max-height: 150px; width: auto;" />
		</figure>

		<div class="flex items-start justify-between">
			<h1 class="title mb-5">Sign In</h1>
		</div>

		{#if form?.error && typeof form.error === 'string'}
			<div class="notification is-danger is-light block py-4 text-black">
				{form.error}
			</div>
		{/if}

		{#if error}
			<div class="notification is-danger is-light py-4 text-black">{error}</div>
		{/if}

		{#if $page.url.searchParams.get('auth-type') === 'magiclink'}
			{#if magicError}<p class="notification is-danger is-light">{magicError}</p>{/if}
			{#if magicSuccess}<p class="notification is-success is-light">{magicSuccess}</p>{/if}
			<form
				action="/?/create-magiclink"
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
							class="input"
							type="email"
							placeholder="Email"
							autocomplete="username"
							required
						/>
					</p>
				</div>
				<div class="field">
					<p class="control">
						<button
							disabled={loadingLogin || magicSuccess}
							class="button is-fullwidth is-link transform transition duration-100 active:scale-105 {loadingLogin
								? 'is-loading'
								: ''}">Send magic link</button
						>
					</p>
				</div>
			</form>

			<div class="mt-6">
				<p class="has-text-centered hover:underline">
					<a href="/">Sign in with email and password</a>
				</p>
			</div>
		{:else}
			<form
				action="/?/signin-with-password"
				method="post"
				use:enhance={() => handleSubmit(event, 'email')}
			>
				<div class="field">
					<label for="email" class="label">Email</label>
					<!-- EMAIL FIELD TOUCHED VARIABLE BELOW NOT USED CURRENTLY -->

					<p class="control">
						<input
							id="email"
							name="email"
							value={form?.values?.email ?? ''}
							on:input={() => (emailFieldTouched = true)}
							class="input"
							type="email"
							autocomplete="username"
							placeholder="Email"
							required
						/>
					</p>
				</div>

				<!-- {#if emailFieldTouched} -->
				<div class="field">
					<label for="password" class="label">Password</label>
					<p class="control">
						<input
							id="password"
							name="password"
							class="input"
							type="password"
							autocomplete="current-password"
							placeholder="Password"
							required
						/>
					</p>
				</div>

				<div class="field">
					<p class="control">
						<button
							class="button is-fullwidth is-link transform transition duration-100 active:scale-105 {loadingLogin
								? 'is-loading'
								: ''}"
							disabled={loadingLogin}>Sign in</button
						>
					</p>
				</div>
			</form>

			<div class="has-text-centered my-4 space-y-2">
				<div class="flex items-center justify-center">
					<div class="h-0.5 w-full bg-gray-100"></div>
					<p class="mx-2">or</p>
					<div class="h-0.5 w-full bg-gray-100"></div>
				</div>

				<form
					class="mb-4"
					action="/?/signin-with-oauth"
					method="post"
					use:enhance={() => handleSubmit(event, 'google')}
				>
					<!-- GITHUB LOGIN BUTTON -->
					<!-- <button
				class="button transform transition duration-100 active:scale-105"
				name="provider"
				value="github"
				type="submit">GitHub</button
			> -->

					<button
						class="{loadingGoogle
							? 'is-loading'
							: ''} button is-secondary inline-flex w-full transform items-center text-center text-black transition duration-100 active:scale-105"
						name="provider"
						value="google"
						type="submit"
						disabled={loadingGoogle}
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
						Sign in with Google
					</button>
				</form>

				<div class="flex items-center justify-center space-x-4">
					<a class="has-text-centered text-sm hover:underline" href="?auth-type=magiclink">
						Sign in with <span class="rainbow-text">magiclink</span>
					</a>

					<a
						href="/"
						class="has-text-centered text-sm hover:underline"
						on:click={handleForgotPassword}>Forgot password</a
					>
				</div>

				<p class="has-text-centered mt-5 text-lg">
					Don't have an account? <a class="font-bold hover:underline" href="/signup"> Sign up</a>
				</p>
			</div>
		{/if}
	</div>

	<!-- FORGOT PASSWORD MODAL -->
	<div class={`modal modal-fx-fadeInScale ${isForgotPasswordModalOpen ? 'is-active' : ''}`}>
		<div
			class="modal-background"
			on:click={() => (isForgotPasswordModalOpen = false)}
			on:keydown={() => (isForgotPasswordModalOpen = false)}
		></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Forgot Password</p>
				<button
					class="delete"
					aria-label="close"
					on:click={() => (isForgotPasswordModalOpen = false)}
				></button>
			</header>
			<section class="modal-card-body px-10 sm:px-20">
				<figure
					class="mt-0 content-center"
					style="max-width: 100%; display: flex; justify-content: center; align-items: center;"
				>
					<img
						class="question-hand"
						src="question-hand.svg"
						alt="Welcome In"
						style="max-height: 160px; width: auto;"
					/>
				</figure>
				{#if resetError}
					<p class="notification is-danger is-light">{resetError}</p>
					<button
						on:click={() => (isForgotPasswordModalOpen = false)}
						class="button specialButton is-link w-full transform py-5 transition-transform duration-100 hover:scale-105"
					>
						Back to login
					</button>
				{:else if resetSuccess}
					<p class="notification is-success is-light">{resetSuccess}</p>
					<button
						on:click={() => (isForgotPasswordModalOpen = false)}
						class="button specialButton is-link w-full transform py-5 transition-transform duration-100 hover:scale-105"
					>
						Back to login
					</button>
				{:else}
					<form
						action="/?/send-reset-password-email"
						method="post"
						use:enhance={() => handleResetPassword(event)}
						class="form py-10"
					>
						<div class="field">
							<label for="reset-email" class="label text-xl font-bold"
								>Enter your email to receive a password reset link:</label
							>
							<div class="control">
								<input
									id="reset-email"
									name="email"
									type="email"
									class="input"
									placeholder="john@example.com"
									required
								/>
							</div>
						</div>
						<!-- <footer class="modal-card-foot"> -->
						<button
							class="button is-primary is-fullwidth is-link {loadingReset ? 'is-loading' : ''}"
							type="submit"
							disabled={loadingReset}
						>
							Send Reset Link
						</button>

						<!-- </footer> -->
					</form>
				{/if}
			</section>
		</div>
	</div>
</section>

<style>
	.rainbow-text {
		background: linear-gradient(
			to right,
			red,
			rgb(248, 91, 0),
			rgb(0, 147, 0),
			blue,
			rgb(96, 0, 164)
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
