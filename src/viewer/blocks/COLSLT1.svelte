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
    <div class="pen">
        <div
            class="sample"
            style="background-color: rgb({color.r},{color.g},{color.b})"
        ></div>

        {color.name}
    </div>
{/each}

<style lang="scss">
    .pen {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        font-weight: bold;

        .sample {
            width: 30px;
            height: 30px;
            display: inline-block;
            border-radius: 50%;
        }
    }
</style>
