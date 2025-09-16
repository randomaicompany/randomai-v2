<script>
	import { run, preventDefault, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	import * as RA from 'ramda-adjunct';
	import * as R from 'ramda';
	//
	import { createEventDispatcher } from 'svelte';
	import { consecutiveUniqueRandom } from 'unique-random';

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
		buttonText = '',
		iconName = 'model_training',
		imageUrl = $bindable(''),
		isLoading = $bindable(false),
		tempPromt = '',
		prompt = $bindable('')
	} = $props();

	run(() => {
		if (!hasInitializedPrompt && !prompt?.trim() && tempPromt?.trim()) {
			console.log('Setting prompt from tempPromt:', tempPromt);
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
	class="relative flex flex-col gap-4"
	onsubmit={preventDefault(() => generate(prompt))}
>
	{#if RA.isNonEmptyArray(stylePresets)}
		<div>
			<label class="input-field-container block w-full">
				<p class="mb-2 text-sm font-medium">Style</p>
				<select
					bind:value={stylePreset}
					class="input-field w-full border border-gray-200 px-2 text-base md:text-sm"
				>
					{#each stylePresets as { name, ...rest }, idx (name)}
						<option selected={idx} value={JSON.stringify({ name, ...rest })}>{name}</option>
					{/each}
				</select>
			</label>
		</div>
	{/if}

	<label
		class="input-field-container input-box input-field shadow-bordered block min-h-[10em] w-full flex-1 items-start gap-4 py-2 pt-3 text-[14px]"
	>
		<textarea
			required
			rows="1"
			maxlength="700"
			disabled={isLoading}
			bind:value={prompt}
			onkeydown={handleKeyDown}
			placeholder="Enter your prompt to generate an image"
			class="mb-10 min-h-[5rem] w-full resize-none border-none font-light outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 {className}"
		></textarea>

		<div
			class="absolute bottom-2 left-[115px] mt-5 flex h-8 items-center gap-3 text-sm md:bottom-4 md:left-[130px]"
		>
			{#if isLoading}
				<div
					style="animation-duration:0.3s;"
					class="border-brand-accent h-5 w-5 animate-spin rounded-full border-2 border-r-transparent bg-transparent"
				></div>
			{:else}
				<button
					onclick={() => generate(prompt)}
					disabled={!prompt}
					class="group relative flex items-center justify-center bg-[#fccc26] transition-all hover:opacity-80 hover:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<p
						class="absolute right-0 flex items-center gap-1 whitespace-nowrap rounded-full bg-[#fccc26] px-3 py-1 text-[12px] font-medium text-white transition-opacity delay-300 md:py-[6px] md:text-[14px]"
					>
						<span class="flex h-4 w-4 items-center justify-center md:w-5">
							<img src="/magic-wand.png" alt="Magic Wand" class="h-4 w-4 object-contain invert" />
						</span>
						Generate
					</p>
				</button>

				<button
					onclick={handlers(bubble('click'), suggestPrompt)}
					type="button"
					disabled={isLoading}
					class:!pl-2={buttonText}
					class="text-brand-green hover:bg-brand-green hover:ring-brand-green group relative flex h-6 w-6 items-center justify-center gap-2 rounded-full ring-1 ring-gray-200 ring-offset-2 transition-all hover:text-white hover:ring-offset-4"
				>
					{#if buttonText}
						<p class="text-[13px]">{buttonText}</p>
					{/if}
					<i class="material-symbols-sharp !text-[21.5px]">{iconName}</i>
					<p
						class="bg-brand-green absolute -bottom-8 select-none whitespace-nowrap rounded-sm px-2 py-1 text-xs text-white opacity-0 transition-opacity delay-300 group-hover:opacity-100"
					>
						Random Prompt
					</p>
				</button>
			{/if}
		</div>
	</label>

	<!-- {#if prompt}
    <div class="pt-4">
      <button
        type="button"
        disabled="{isLoading}"
        on:click="{() => generate(prompt)}"
        class:pointer-events-none="{isLoading}"
        class="gap-2 button button-gradient-bg-var-5 button-compact">
        <i class:!animate-spin="{isLoading}" class="material-symbols-sharp !text-[21.5008px]">refresh</i>
        {#if isLoading}
          <span>Generating...</span>
        {:else}
          <span> Re-Generate </span>
        {/if}
      </button>
    </div>
    {/if} -->
</form>
