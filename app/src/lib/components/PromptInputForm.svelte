<script>
	import { run, preventDefault, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import * as RA from 'ramda-adjunct';
	import * as R from 'ramda';
	//
	import { createEventDispatcher } from 'svelte';
	import { consecutiveUniqueRandom } from 'unique-random';
	import StyleDropdown from './StyleDropdown.svelte';

	let hasInitializedPrompt = $state(false);
	/**
	 * @typedef {Object} Props
	 * @property {any} [aiSettings]
	 * @property {any} [promptSuggestions]
	 * @property {any} [stylePresets]
	 * @property {string} [class]
	 * @property {string} [buttonText]
	 * @property {string} [iconName]
	 * @property {string} [imageUrl]
	 * @property {boolean} [isLoading]
	 * @property {string} [tempPromt]
	 * @property {string} [prompt]
	 */

	/** @type {Props} */
	let {
		aiSettings = {},
		promptSuggestions = [],
		stylePresets = [],
		class: className = '',
		iconName = 'model_training',
		imageUrl = $bindable(''),
		isLoading = $bindable(false),
		tempPromt = '',
		prompt = $bindable('')
	} = $props();

	run(() => {
		if (!hasInitializedPrompt && !prompt?.trim() && tempPromt?.trim()) {
			prompt = tempPromt;
			hasInitializedPrompt = true;
		}
	});

	let stylePreset = $state(JSON.stringify(R.head(stylePresets)));

	const dispatch = createEventDispatcher();
	const random = consecutiveUniqueRandom(0, R.dec(R.length(promptSuggestions)));

	const generate = async (prompt = '') => {
		const cleanPrompt = prompt.trim();
		const { prefix, suffix } = JSON.parse(stylePreset);

		if (!cleanPrompt) return;
		isLoading = true;

		const finalPrompt = prefix + prompt + suffix;
		localStorage.setItem('tempPromt', prompt);

		const response = await fetch('/api/generate', {
			method: 'POST',
			body: JSON.stringify({
				...aiSettings,
				prompt: finalPrompt
			})
		});

		const imageResponse = await response.json();

		imageUrl = R.prop('src', imageResponse);
		isLoading = false;
		localStorage.setItem('imageUrl', imageUrl);
		dispatch('generate', imageUrl);
		return imageUrl;
	};

	const suggestPrompt = () => {
		const randomIdx = random();
		const suggestedPrompt = promptSuggestions[randomIdx];
		prompt = suggestedPrompt;
		generate(prompt);
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (!isLoading && prompt.trim()) {
				generate(prompt);
			}
		}
	};
</script>

<form
	class:opacity-50={isLoading}
	class="relative flex flex-col"
	onsubmit={preventDefault(() => generate(prompt))}
>
	<div
		class="input-field-container shadow-bordered relative flex w-full flex-col rounded-md border border-gray-200 bg-white p-3 pb-14 text-[14px]"
	>
		<textarea
			required
			rows="1"
			maxlength="700"
			disabled={isLoading}
			bind:value={prompt}
			onkeydown={handleKeyDown}
			placeholder="Enter your prompt to generate an image"
			style="field-sizing: content;"
			class="outline-hidden focus:outline-hidden min-h-12 w-full resize-none overflow-hidden border-none bg-transparent font-light ring-0 focus:border-none focus:ring-0 {className}"
		></textarea>

		<div class="absolute bottom-3 right-3 flex items-center gap-1.5">
			{#if RA.isNonEmptyArray(stylePresets)}
				<StyleDropdown {stylePresets} bind:selectedStyle={stylePreset} disabled={isLoading} />
			{/if}

			{#if !isLoading}
				<button
					onclick={handlers(bubble('click'), suggestPrompt)}
					type="button"
					disabled={isLoading}
					class="text-brand-green hover:bg-brand-green group flex h-8 w-8 flex-shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-1.5 ring-1 ring-gray-200 duration-500 hover:w-24 hover:text-white"
				>
					<i class="material-symbols-sharp flex-shrink-0 !text-[20px]">{iconName}</i>
					<span class="whitespace-nowrap text-sm font-medium"> Random </span>
				</button>
			{/if}

			{#if isLoading}
				<div
					style="animation-duration:0.3s;"
					class="border-brand-accent h-5 w-5 animate-spin rounded-full border-2 border-r-transparent bg-transparent"
				></div>
			{:else}
				<button
					onclick={() => generate(prompt)}
					disabled={!prompt}
					class="group flex h-8 w-8 flex-shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-[#fccc26] px-1.5 duration-500 hover:w-28 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="flex h-5 w-5 flex-shrink-0 items-center justify-center">
						<img src="/magic-wand.png" alt="Magic Wand" class="h-5 w-5 object-contain invert" />
					</span>
					<span class="whitespace-nowrap text-sm font-medium text-white">Generate</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- {#if prompt}
    <div class="pt-4">
      <button
        type="button"
        disabled="{isLoading}"
        on:click="{() => generate(prompt)}"
        class:pointer-events-none="{isLoading}"
        class="gap-2 button button-gradient-bg-var-5 button-compact">
        <i class:!animate-spin="{isLoading}" class="material-symbols-sharp text-[21.5008px]!">refresh</i>
        {#if isLoading}
          <span>Generating...</span>
        {:else}
          <span> Re-Generate </span>
        {/if}
      </button>
    </div>
    {/if} -->
</form>
