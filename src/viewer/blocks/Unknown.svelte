<script lang="ts">
    import BlobImage from "../../components/BlobImage.svelte";
    import type { BPK1File } from "../../lib/libdoodle/libdoodle.svelte";
    import type { BPK1Block } from "../../lib/libdoodle/wasm/libdoodle_wasm";
    import HexView from "../components/HexView.svelte";

    let {
        file,
        block,
    }: {
        file: BPK1File;
        block: BPK1Block;
    } = $props();
</script>

<b>{block.name}</b> is an unrecognized block.

<HexView data={block.data}></HexView>
