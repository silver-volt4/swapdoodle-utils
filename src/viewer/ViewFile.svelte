<script lang="ts">
    import { BPK1File } from "../lib/libdoodle/libdoodle.svelte";
    import type { BPK1Block } from "../lib/libdoodle/wasm/libdoodle_wasm";
    import type { SvelteComponent } from "svelte";
    import Unknown from "./blocks/Unknown.svelte";
    import { askForFile } from "../lib/files.svelte";
    import Icon from "@jamescoyle/svelte-icon";
    import { mdiPlus, mdiDownload } from "@mdi/js";

    const READERS: { [key: string]: { default: () => SvelteComponent } } =
        import.meta.glob(["./blocks/*.svelte", "!./blocks/Unknown.svelte"], {
            eager: true,
        });

    let {
        file,
    }: {
        file: BPK1File;
    } = $props();

    async function insertBlock() {
        let files = await askForFile();
        let selected = files?.[0];

        if (selected) {
            let string = prompt("Block name? (max 7 characters)");
            if (string) {
                let name = string.substring(0, 7);

                file.blocks.push({
                    name: name,
                    data: new Uint8Array(await selected.arrayBuffer()),
                });
            }
        }
    }
</script>

<div class="flex grow">
    <div class="md:w-70 w-30 flex flex-col shrink-0 shadow-xl bg-zinc-100">
        <div class="p-3 bg-zinc-300 border-b-2 border-b-zinc-500 font-bold">
            File options
        </div>
        <button
            class="btn px-3 py-2 text-start hover:bg-zinc-200 flex gap-2"
            onclick={() => file.downloadDecompressedBpk("export.bpk1")}
        >
            <Icon path={mdiDownload} type="mdi" color="black"></Icon>
            Save (uncompressed BPK1)
        </button>

        <div class="p-3 bg-zinc-300 border-b-2 border-b-zinc-500 font-bold">
            BPK1 Blocks
        </div>
        {#each file.blocks as block, i}
            <button
                class="btn px-3 py-2 text-start {file.selectedBlock === block
                    ? 'bg-zinc-400'
                    : 'hover:bg-zinc-200'} transition"
                onclick={() => file.selectBlock(i)}
            >
                {block.name}
            </button>
        {/each}
        <button
            class="btn px-3 py-2 text-start hover:bg-zinc-200 flex gap-2"
            onclick={insertBlock}
        >
            <Icon path={mdiPlus} type="mdi" color="black"></Icon>
            Insert block
        </button>
    </div>
    <div class="grow p-4 overflow-y-auto">
        {#if file.selectedBlock}
            <div class="heading">
                <button
                    class="btn std mb-2"
                    onclick={() => file.downloadBpkBlock(file.selectedBlock!)}
                    >Save this block</button
                >
            </div>
            {@const Reader =
                READERS[`./blocks/${file.selectedBlock.name}.svelte`]?.default}
            {#if Reader}
                <Reader {file} block={file.selectedBlock} />
            {:else}
                <Unknown {file} block={file.selectedBlock} />
            {/if}
        {/if}
    </div>
</div>
