<script>
	export let data;

	$: ({ testTable, user } = data);
	// console.log(data);
</script>

<div class="block md:mx-32">
	<div class="introDiv py-6">
		<div class="row flex items-center space-x-4">
			<p class="text-4xl">👋</p>
			<div>
				<p class="text-xl sm:text-4xl">Hey {user.email}!</p>
				<span class="text-md">Welcome home.</span>
			</div>
		</div>
	</div>
	<div
		class="MAINCONTAINER grid grid-cols-1 grid-rows-1 gap-4 rounded border border-opacity-50 bg-stone-50 p-4 text-black shadow-sm hover:cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
	>
		<div class="h-full p-4">
			<p class="pb-2 text-xl">Quick Actions</p>
			<p class="text-xs opacity-50">Instantly available.</p>
		</div>
		<div
			class="duration-10 hover:border-black-100 h-full rounded border border-opacity-50 bg-white p-10 transition hover:scale-105 hover:cursor-pointer"
		>
			<p>Thing 2</p>
		</div>
		<div
			class="duration-10 hover:border-black-100 h-full rounded border border-opacity-50 bg-white p-10 transition hover:scale-105 hover:cursor-pointer"
		>
			<p>Thing 3</p>
		</div>
		<div
			class="duration-10 hover:border-black-100 h-full rounded border border-opacity-50 bg-white p-10 transition hover:scale-105 hover:cursor-pointer"
		>
			<p>Thing 4</p>
		</div>
	</div>
</div>

<div class="block md:mx-32">
	<p>Protected content for {user.email}</p>
	<p>server-side fetched data with RLS:</p>
	<pre>{JSON.stringify(testTable, null, 2)}</pre>
</div>
<div class="block md:mx-32">
	<p>user:</p>
	<pre>{JSON.stringify(user, null, 2)}</pre>
</div>
