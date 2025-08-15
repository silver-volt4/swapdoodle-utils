<script lang="ts">
    import { slide } from "svelte/transition";

    let {
        data,
    }: {
        data: Uint8Array;
    } = $props();

    let displayed = $state(false);

    function hexdigit(i: number) {
        let s = i.toString(16).substring(0, 2);
        if (s.length === 1) {
            s = "0" + s;
        }
        return s;
    }
</script>

<div>
    <button class="btn std" onclick={() => (displayed = !displayed)}>
        {#if displayed}
            Hide raw bytes
        {:else}
            Show raw bytes
        {/if}
    </button>
    {#if displayed}
        <div transition:slide>
            <div class="bg-white px-2 py-1 inline-block shadow-xl mt-2 select-all">
                <code class="whitespace-nowrap">
                    {#each data as i, index}
                        {#if index && index % 16 === 0}
                            <br />
                        {/if}
                        {hexdigit(i)}
                    {/each}
                </code>
            </div>
        </div>
    {/if}
</div>
