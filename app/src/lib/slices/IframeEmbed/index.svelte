<script>
  import { asText } from "@prismicio/client";
  import { PrismicText } from "@prismicio/svelte";

  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { extractScriptsFromHTML } from "root/src/lib/utils";

  export let slice;
  let iframe;

  const buildIframe = () => {
    const headHTMLString = asText(slice.primary.head);
    const bodyHTMLString = asText(slice.primary.body);

    const iframeWindow = iframe.contentWindow;
    const headScripts = extractScriptsFromHTML(headHTMLString);
    const bodyScripts = extractScriptsFromHTML(bodyHTMLString);

    iframeWindow.document.head.innerHTML = headHTMLString;
    iframeWindow.document.body.innerHTML = bodyHTMLString;

    headScripts.forEach((script) =>
      iframeWindow.document.head.appendChild(script)
    );
    bodyScripts.forEach((script) =>
      iframeWindow.document.body.appendChild(script)
    );
  };

  onMount(() => {
    if (!iframe || !browser) return;
    iframe.addEventListener("load", buildIframe);
  });

  onDestroy(() => {
    if (!iframe || !browser) return;
    iframe.removeEventListener("load", buildIframe);
  });
</script>

<section class="shell max-w-4xl">
  <div class="m-auto">
    <h2 class="heading-2xl mb-2 md:mb-4">
      <PrismicText field={slice.primary.heading} />
    </h2>
    <p class="text-base text-brand-secondary">
      <PrismicText field={slice.primary.subtext} />
    </p>
  </div>

  {#if browser}
    <iframe
      bind:this={iframe}
      style="min-height: {slice.primary.minimum_height + 'rem'}"
      class="!aspect-auto w-full overflow-hidden"
      title={asText(slice.primary.heading)}
      src="/iframeEmbed.html"></iframe>
  {/if}
</section>
