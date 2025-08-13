<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import current from "../lib/dialog.svelte";
</script>

{#if current()}
    <div class="z-20 fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)]" transition:fade>
        <div class="overflow-hidden bg-white flex flex-col shadow-xl" in:scale out:fade>
            <div class="bg-zinc-200 py-2 px-3 min-w-100">
                {current()?.title}
            </div>
            <div class="py-2 px-3 whitespace-pre-line">
                {current()?.message}
            </div>
            <div class="bg-zinc-200">
                {#each current()?.buttons ?? [] as button}
                    <button class="btn py-2 px-3 font-bold " onclick={() => current()?.resolver(button.id)}>
                        {button.label}
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}
