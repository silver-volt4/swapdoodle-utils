<script lang="ts">
    import type { derived } from "svelte/store";
    import Doodle from "../../components/Doodle.svelte";
    import type {
        BPK1Block,
        BPK1File,
        Colors,
        Sheet,
    } from "../../lib/libdoodle/libdoodle.svelte";
    import {
        parse_colors,
        parse_sheet,
    } from "../../lib/libdoodle/libdoodle.svelte";

    let {
        file,
        block,
    }: {
        file: BPK1File;
        block: BPK1Block;
    } = $props();

    let availableColors = $derived(
        file.blocks.filter((k) => k.name === "COLSLT1"),
    );
    let sheet: Sheet = $derived(parse_sheet(block));

    let colors = $derived(
        availableColors[0] ? parse_colors(availableColors[0]) : undefined,
    );
</script>

<Doodle {sheet} {colors} />
