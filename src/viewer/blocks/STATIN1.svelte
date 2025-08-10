<script lang="ts">
    import type { derived } from "svelte/store";
    import Doodle from "../../components/Doodle.svelte";
    import type {
        BPK1Block,
        BPK1File,
        Stationery,
    } from "../../lib/libdoodle/libdoodle.svelte";
    import {
        parse_l4_data,
        parse_stationery,
    } from "../../lib/libdoodle/libdoodle.svelte";
    import StationeryComponent from "../../components/Stationery.svelte";
    import BlobImage from "../../components/BlobImage.svelte";
    import L4Image from "../../components/L4Image.svelte";
    import { openNewFile } from "../../lib/files.svelte";

    let {
        file,
        block,
    }: {
        file: BPK1File;
        block: BPK1Block;
    } = $props();

    let stationery = $derived(parse_stationery(block));
    let background_2d = $derived(
        new Blob([stationery.background_2d] as BlobPart[]),
    );
    let background_3d = $derived(
        new Blob([stationery.background_3d] as BlobPart[]),
    );
</script>

<div>
    <b>STATIN1</b> blocks contain Stationery data.
</div>
<div>
    <b>Hint</b>: STATIN1 itself is a BPK1 archive. <button onclick={() => {openNewFile(block.data)}}>Open in new tab</button>
</div>

<BlobImage src={background_2d} />
<BlobImage src={background_3d} />
<L4Image src={stationery.mask} baseHeight={256} baseWidth={256} />
