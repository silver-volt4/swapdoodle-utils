<script lang="ts">
    import { BPK1File } from "../lib/libdoodle/libdoodle.svelte";
    import type { BPK1Block } from "../lib/libdoodle/wasm/libdoodle_wasm";
    import type { SvelteComponent } from "svelte";
    import Unknown from "./blocks/Unknown.svelte";
    import { askForFile } from "../lib/files.svelte";

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

<div class="viewer">
    <div class="blocks">
        <div class="title">BPK1 Blocks</div>
        {#each file.blocks as block, i}
            <button
                onclick={() => (file.selectBlock(i))}
                class:active={file.selectedBlock === block}
            >
                {block.name}
            </button>
        {/each}
        <button onclick={insertBlock}> + INSERT BLOCK </button>
    </div>
    <div class="viewerArea">
        {#if file.selectedBlock === null}
            Select a block on the left
        {:else}
            <div class="heading">
                Viewing: {file.selectedBlock.name}
                <button onclick={() => file.downloadBpkBlock(file.selectedBlock!)}
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

<style lang="scss">
    .viewer {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: row;
    }

    .title {
        margin: 0.5em;
        font-weight: bold;
    }

    .blocks {
        display: flex;
        flex-direction: column;
        width: 300px;
        background-color: white;
        overflow: auto;
    }

    .viewerArea {
        overflow: auto;
        flex: 1;
        padding: 1em;
    }

    .blocks button {
        padding: 0.5em 1em;
        background-color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        text-align: start;

        &.active {
            background-color: aqua;
        }
    }

    div.heading {
        padding: 0.5em 1em;
        background-color: white;
        border: none;
        box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
        font-size: 18px;
        margin-bottom: 1em;
    }
</style>
