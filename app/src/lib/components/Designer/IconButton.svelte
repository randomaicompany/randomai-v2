<script>
	import { fade, fly } from "svelte/transition";

	let { label = '', iconName = '', className = '', onclick } = $props();

	let visible = $state(false);
</script>

<div class="relative inline">
	{#if label && visible}
		<p transition:fly={{duration:200, y:4}} class="absolute inset-0 sm-translate-x-8 -translate-x-2 sm:-translate-y-12 -translate-y-8 whitespace-nowrap text-xs">
			<span class="bg-brand-accent inline-block rounded-lg py-0.5 px-2 text-white">{label}</span>
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
