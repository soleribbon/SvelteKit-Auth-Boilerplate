<script>
	import { page } from '$app/stores';
</script>

<div class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<figure
		class="mt-0 content-center p-4"
		style="max-width: 100%; display: flex; justify-content: center; align-items: center;"
	>
		<img
			class="lonely-desert"
			src="lonely-desert.svg"
			alt="Nothing found here!"
			style="max-height: 150px; width: auto;"
		/>
	</figure>

	<div class="mx-10 mb-10 flex flex-col items-center">
		<h1 class="text-6xl font-bold text-stone-900">
			{$page.status}
		</h1>

		<p class="text-lg text-stone-900">{$page.error.message}</p>
	</div>
	<a
		href="/"
		class="button is-link is-large transform bg-white font-bold transition duration-100 active:scale-105"
	>
		Go back home
	</a>
</div>
