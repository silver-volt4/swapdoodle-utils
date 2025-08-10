<script lang="ts">
    import type {
        BPK1Block,
        BPK1File,
        Colors,
    } from "../../lib/libdoodle/libdoodle.svelte";
    import { parse_colors } from "../../lib/libdoodle/libdoodle.svelte";

    let {
        file,
        block,
    }: {
        file: BPK1File;
        block: BPK1Block;
    } = $props();

    let colors: Colors = $derived(parse_colors(block));
</script>

{#each colors.colors as color}
    <div>
        <div
            class="pen"
            style="background-color: rgb({color.r},{color.g},{color.b})"
        ></div>
    </div>
{/each}

<style>
    .pen {
        width: 20px;
        height: 20px;
    }
</style>
