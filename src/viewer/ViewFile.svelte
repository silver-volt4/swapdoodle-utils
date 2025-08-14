<script lang="ts">
    import { BPK1File } from "../lib/libdoodle/libdoodle.svelte";
    import type { SvelteComponent } from "svelte";
    import Unknown from "./blocks/Unknown.svelte";
    import { askForFile } from "../lib/files.svelte";
    import Icon from "@jamescoyle/svelte-icon";
    import { mdiPlus, mdiDownload, mdiTrashCan, mdiClose } from "@mdi/js";

    const READERS: { [key: string]: { default: () => SvelteComponent } } =
        import.meta.glob(["./blocks/*.svelte", "!./blocks/Unknown.svelte"], {
            eager: true,
        });

    let {
        file,
        onclose
    }: {
        file: BPK1File;
        onclose: () => any
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

{#snippet header(label: string)}
    <div class="p-3 bg-yellow-200 border-b-2 border-b-yellow-700 font-bold">
        {label}
    </div>
{/snippet}

{#snippet button(
    label: string,
    onclick: (e: Event) => any,
    icon: string | null = null,
    active: boolean = false,
    classes?: string,
)}
    <button
        class="btn px-3 py-2 text-start transition flex gap-2 {classes} {active
            ? 'bg-yellow-400 hover:bg-yellow-500'
            : 'hover:bg-yellow-300'}"
        {onclick}
    >
        {#if icon}
            <Icon path={icon} type="mdi" color="black"></Icon>
        {/if}
        {label}
    </button>
{/snippet}

<div class="flex grow">
    <div class="md:w-70 w-30 flex flex-col shrink-0 shadow-xl bg-yellow-100">
        {@render header("File options")}
        {@render button(
            "Save BPK1 (uncompressed)",
            () => file.downloadDecompressedBpk("export.bpk1"),
            mdiDownload,
        )}
        {@render button(
            "Close file",
            onclose,
            mdiClose,
        )}

        {@render header("BPK1 Blocks")}
        {#each file.blocks as block, i}
            <div class="flex">
                {@render button(
                    block.name,
                    () => file.selectBlock(i),
                    null,
                    file.selectedBlock === block,
                    "grow"
                )}
                {@render button(
                    "",
                    () => file.deleteBlock(i),
                    mdiTrashCan,
                    file.selectedBlock === block,
                )}
            </div>
        {/each}
        {@render button("Insert block", insertBlock, mdiPlus)}
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
