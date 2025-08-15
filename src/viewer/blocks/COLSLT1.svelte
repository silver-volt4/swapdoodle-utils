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
    COLSLT1 blocks contain the pens used in the doodles (see SHEET1). This
    includes the name and RGB color.
</Card>

{#each colors.colors as color}
    <div class="flex items-center gap-2 mb-2 font-bold">
        <div
            class="w-8 h-8 rounded-full overflow-hidden relative"
            style="background-color: rgba({color.primary.r},{color.primary
                .g},{color.primary.b},{color.primary.a})"
        >
            <div
                class="w-[50%] h-[50%] absolute bottom-0"
                style="background-color: rgba({color.extra1.r},{color.extra1
                    .g},{color.extra1.b},{color.extra1.a})"
            ></div>
            <div
                class="w-[50%] h-[50%] absolute right-0 top-0"
                style="background-color: rgba({color.extra2.r},{color.extra2
                    .g},{color.extra2.b},{color.extra2.a})"
            ></div>
            <div
                class="w-[50%] h-[50%] absolute right-0 bottom-0"
                style="background-color: rgba({color.extra3.r},{color.extra3
                    .g},{color.extra3.b},{color.extra3.a})"
            ></div>
        </div>

        {color.name}
    </div>
{/each}
