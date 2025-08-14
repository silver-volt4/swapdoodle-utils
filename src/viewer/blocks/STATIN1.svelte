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
    import Card from "../../components/Card.svelte";

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

<Card style="info" title="About THUMB2" class="mb-2">
    STATIN1 blocks contain the stationery of the note.
</Card>

<Card style="info" title="By the way..." class="mb-2">
    STATIN1 blocks themselves are BPK1 archives.
    <div class="mt-2">
        <button
            class="btn std"
            onclick={() => {
                openNewFile(block.data);
            }}>Open in new tab</button
        >
    </div>
</Card>

<BlobImage src={background_2d} />
<BlobImage src={background_3d} />
<L4Image src={stationery.mask} baseHeight={256} baseWidth={256} />
