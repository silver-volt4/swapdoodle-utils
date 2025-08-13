<script lang="ts">
    import Card from "../../components/Card.svelte";
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

<Card style="info" title="About COLSLT1" class="mb-2">
    COLSLT1 blocks contain the pens used in the doodles (see SHEET1). This includes the name and RGB color.
</Card>

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
