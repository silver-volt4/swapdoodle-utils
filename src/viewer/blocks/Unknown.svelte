<script lang="ts">
    import BlobImage from "../../components/BlobImage.svelte";
    import Card from "../../components/Card.svelte";
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

<Card style="warning" title="Unknown block" class="mb-2">
    This block is not yet supported and it not will be parsed. <br />
    The hex dump of its content is shown below.
</Card>

<HexView data={block.data}></HexView>
