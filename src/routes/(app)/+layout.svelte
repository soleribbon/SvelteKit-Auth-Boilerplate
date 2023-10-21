<script>
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	let loading = false;

	const handleLogout = () => {
		loading = true;
		return async ({ result }) => {
			await invalidate('supabase:auth');
			await applyAction(result);
			loading = false;
		};
	};

	let isActive = false; // Flag to keep track of the navbar menu state

	function toggleMenu() {
		isActive = !isActive;
	}
</script>

<svelte:head>
	<title>Ravi's Dashboard</title>
</svelte:head>

<main class="container px-4 sm:px-14">
	<body class="has-navbar-fixed-top">
		<nav
			class="navbar has-shadow is-fixed-top bg-white px-4 py-2 sm:mb-2 sm:pt-4 md:mx-32"
			aria-label="main navigation"
		>
			<div class="navbar-brand rounded p-2 font-extrabold">
				<!-- ALWAYS ON THE LEFT -->
				<img class="logoImage" src="/favicon.svg" alt="Ravi's Logo" width="50" height="50" />
				<a class="navbar-item" href="/">
					<span class="">Ravi's Dash</span>
				</a>

				<!-- MOBILE HAMBURGER -->
				<div
					role="button"
					class:is-active={isActive}
					class="navbar-burger"
					tabindex="0"
					href="/"
					aria-label="menu"
					aria-expanded="false"
					data-target="desktopNavbar"
					on:click={toggleMenu}
					on:keydown={toggleMenu}
				>
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</div>
			</div>

			<!-- navbar-menu is HIDDEN on touch devices -->
			<div id="desktopNavbar" class="navbar-menu px-2 {isActive ? 'is-active' : ''}">
				<!-- style="position: absolute; width: 100%; z-index: 1;" -->

				<div class="navbar-start">
					<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}> Home </a>
					<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}>
						Documentation
					</a>
					<div class="navbar-item has-dropdown is-hoverable">
						<a class="navbar-link" href="/" on:click={toggleMenu} on:keydown={toggleMenu}> More </a>

						<div class="navbar-dropdown">
							<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}>
								About
							</a>
							<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}>
								Jobs
							</a>
							<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}>
								Contact
							</a>
							<hr class="navbar-divider" />
							<a class="navbar-item" href="/" on:click={toggleMenu} on:keydown={toggleMenu}>
								Report an issue
							</a>
						</div>
					</div>
				</div>

				<div class="navbar-end">
					<div class="navbar-item">
						{#if $page.data.session}
							<form class="rounded p-2" action="/logout" method="post" use:enhance={handleLogout}>
								<button
									class="button is-dark transform transition duration-100 active:scale-105"
									disabled={loading}
									type="submit"
									href="/"
									on:click={toggleMenu}
									on:keydown={toggleMenu}
								>
									<strong>Sign out</strong>
								</button>
							</form>
						{:else}
							<a class="rounded p-2" href="/signup" method="post">
								<button
									class="button is-secondary transform transition duration-100 active:scale-105 active:bg-gray-100"
									disabled={loading}
									on:click={toggleMenu}
									on:keydown={toggleMenu}
									type="submit"
								>
									<strong>Create Account</strong>
								</button>
							</a>
						{/if}
					</div>
				</div>
			</div>
		</nav>

		<slot />
	</body>
</main>
