<script>
  import "src/app.css";
  import "material-symbols";
  import user from "root/src/lib/stores/user";
  import { signInAnonymously } from "root/src/lib/api/firebase/auth";

  //
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  let { data = {}, children } = $props();

  onMount(async () => {
    if (!browser) return;
    const currentUser = await signInAnonymously();
    user.set(currentUser);
  });
</script>

<svelte:head>
  {#if data.data.head && data.data.head.length > 0}
    {@html data.data.head[0].text}
  {/if}
</svelte:head>

<Header {data} />

<main class="min-h-[100vh]">
  {@render children?.()}
</main>

<Footer {data} />

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
