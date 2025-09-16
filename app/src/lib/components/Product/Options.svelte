<script>
  import axios from "axios";
  import * as R from "ramda";
  import { page } from "$app/stores";
  import { createEventDispatcher, onMount } from "svelte";
  import Accordion from "../Accordion.svelte";

  export let choice = {};
  export let product = {};
  export let selectedVariant = {};

  const dispatch = createEventDispatcher();

  const findVariant = (choice, variants) =>
    R.find((variant) => {
      if (
        variant.option1 === choice.option1 &&
        variant.option2 === choice.option2
      ) {
        return variant;
      }
    }, variants);

  const fetchAndSetHexColors = R.pipe(
    R.always("/api/colors"),
    axios.get,
    R.andThen(R.prop("data"))
  );

  const getMatchedColors = R.curry((listOfName, listWithHex) => {
    const uniqColorsWithHex = R.uniqBy(R.prop("name"), listWithHex);
    return R.filter(
      ({ name }) => R.includes(name, listOfName),
      uniqColorsWithHex
    );
  });

  const setOption = R.curry((value, position, _) => {
    const positionString = R.toString(R.inc(position));
    const key = R.concat("option", positionString);
    choice = { ...choice, [key]: value };
    selectedVariant = findVariant(choice, product.variants);
    return dispatch("change", selectedVariant);
  });

  const setInitialChoices = (variant) => {
    const options = R.pick(["option1", "option2", "option3"], variant);
    choice = options;
    selectedVariant = variant;
  };

  onMount(() => {
    const variantId = $page.url.searchParams.get("variant");
    const variant = R.find(({ id }) => id == variantId, product.variants);
    const defaultVariant = R.defaultTo(R.head(product.variants), variant);
    setInitialChoices(defaultVariant);
  });
</script>

<div class="flex flex-col">
  <div class="mt-4 flex flex-wrap">
    {#await fetchAndSetHexColors()}
      <p>Loading...</p>
    {:then colorsList}
      <ul class="flex w-full flex-col gap-2">
        {#each product.options as option, idx}
          {@const optionKey = R.concat("option", R.toString(R.inc(idx)))}

          {#if R.propEq("Color", "name", option)}
            <li>
              <Accordion isOpen={true} name={option.name}>
                <ul class="flex flex-wrap gap-2 pl-1 pt-1 text-center">
                  {#each getMatchedColors(option.values, colorsList) as { name, hex }}
                    {@const isActive = R.propEq(name, optionKey, choice)}
                    <li>
                      <button
                        title={name}
                        style="background-color: {hex};"
                        on:click={setOption(name, idx)}
                        class:!ring-brand-primary={isActive}
                        class="h-6 w-6 rounded-full border-2 outline-none ring-2 ring-transparent ring-offset-1 transition-all hover:ring-brand-tertiary active:opacity-80"
                      ></button>
                    </li>
                  {/each}
                </ul>
              </Accordion>
            </li>
          {/if}

          {#if R.propEq("Size", "name", option)}
            <Accordion isOpen={true} name={option.name}>
              <ul class="flex flex-wrap gap-2 pt-1">
                {#each option.values as size}
                  {@const isActive = R.propEq(size, optionKey, choice)}
                  <li>
                    <button
                      on:click={setOption(size, idx)}
                      class:!border-brand-primary={isActive}
                      class="h-9 w-10 border-2 text-sm">{size}</button>
                  </li>
                {/each}
              </ul>
            </Accordion>
          {/if}
        {/each}
      </ul>
    {/await}
  </div>
</div>
