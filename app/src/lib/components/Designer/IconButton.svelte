<script>
	let { label = '', iconName = '', className = '', onclick } = $props();

	let visible = $state(false);
</script>

<div class="relative inline">
	{#if label && visible}
		<p class="absolute inset-0 -translate-x-8 -translate-y-12 whitespace-nowrap text-xs">
			<span class="bg-brand-accent inline-block rounded p-1 text-white">{label}</span>
		</p>
	{/if}

	<button
		{onclick}
		onmouseenter={() => (visible = true)}
		onmouseleave={() => (visible = false)}
		class="outline-hidden hover:bg-brand-accent hover:border-brand-accent group relative flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-all hover:text-white active:bg-gray-200 {className}"
	>
		<i class="material-symbols-rounded text-xl!">{iconName}</i>
	</button>
</div>
