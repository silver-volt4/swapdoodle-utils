<script lang="ts">
    import packageFile from "../package.json";
    import { BPK1File } from "./lib/libdoodle/libdoodle.svelte";
    import { warn } from "./lib/toast.svelte";
    import Toast from "./components/Toast.svelte";
    import ViewFile from "./viewer/ViewFile.svelte";
    import Dialog from "./components/Dialog.svelte";
    import MenuButton from "./components/MenuBar/MenuButton.svelte";
    import current from "./lib/dialog.svelte";
    import { askForFile, files, openNewFile, type OpenFile, getCurrentFile, setCurrentFile } from "./lib/files.svelte";

    function dragOver(e: Event) {
        e.preventDefault();
    }

    async function drop(e: DragEvent) {
        e.preventDefault();

        let files = e.dataTransfer?.files;
        if (!files) return;
        for (let file of files) {
            if (file) {
                await openNewFile(file);
            }
        }
    }

    async function fileOpen() {
        let files = await askForFile();
        for (let file of files ?? []) {
           await openNewFile(file);
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="root" ondragover={dragOver} ondrop={drop}>
    <div class="bar menu depth">
        <MenuButton label="File">
            <MenuButton label="Open" onclick={fileOpen} />
            {#if getCurrentFile}
                <MenuButton
                    label="Save (decompressed BPK1 archive)"
                    onclick={() =>
                        getCurrentFile()!.file.downloadDecompressedBpk("letter.bpk")}
                />
            {/if}
        </MenuButton>

        <span class="end">
            Swapdoodle-Utils v{packageFile.version}
        </span>
    </div>
    <div class="bar files">
        {#each files as file, i}
            <button
                onclick={() => (setCurrentFile(file))}
                class="base {getCurrentFile() === file ? 'focused' : ''}"
            >
                {file.name}
            </button>
        {/each}
    </div>
    <div class="viewport">
        {#if getCurrentFile()}
            <ViewFile file={getCurrentFile()!.file}></ViewFile>
        {/if}
    </div>
</div>

<Toast></Toast>
<Dialog></Dialog>

<style lang="scss">
    .root {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;

        input[type="file"] {
            display: none;
        }
    }

    .viewport {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }

    .bar {
        display: flex;
        width: 100%;
        background-color: white;

        &.menu {
            z-index: 1;
        }

        &.files {
            background-color: silver;

            button {
                border: 0;
                background: none;
                padding: 8px;
                font-weight: bold;
                border-bottom: solid 2px transparent;
                &.focused {
                    background-color: rgba(0, 0, 0, 0.1);
                    border-bottom-color: black;
                }
            }
        }

        .end {
            flex: 1;
            text-align: end;
            align-self: center;
            padding-right: 8px;
        }
    }
</style>
