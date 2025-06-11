<script lang="ts">
    import packageFile from "../package.json";
    import { LetterFile } from "./lib/libdoodle/libdoodle.svelte";
    import { warn } from "./lib/toast.svelte";
    import Toast from "./components/Toast.svelte";
    import ViewFile from "./pages/ViewFile.svelte";
    import Dialog from "./components/Dialog.svelte";
    import MenuButton from "./components/MenuBar/MenuButton.svelte";

    type OpenFile = {
        file: LetterFile;
        name: string;
    };

    let fileInput: HTMLInputElement = $state()!;

    let files: OpenFile[] = $state([]);
    let focusedFile: OpenFile | undefined = $state();

    function dragOver(e: Event) {
        e.preventDefault();
    }

    function drop(e: DragEvent) {
        e.preventDefault();

        let files = e.dataTransfer?.files;
        if (!files) return;
        for (let file of files) {
            if (file) {
                readFile(file);
            }
        }
    }

    function fileOpen() {
        fileInput.click();
    }

    function fileSelected(e: Event) {
        let file = (e.target as HTMLInputElement | null)?.files?.[0];
        if (file) {
            readFile(file);
        }
    }

    async function readFile(file: File) {
        try {
            let letter = await LetterFile.readFile(file);
            focusedFile = {
                name: file.name,
                file: letter,
            };
            files.push(focusedFile);
        } catch (e) {
            let message = (e as Partial<Error>)?.message;
            warn({
                title: "Error reading file",
                message: message ?? "Unknown error",
            });
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="root" ondragover={dragOver} ondrop={drop}>
    <div class="bar menu depth">
        <MenuButton label="File">
            <MenuButton label="Open..." onclick={fileOpen}></MenuButton>
        </MenuButton>

        <span class="end">
            Swapdoodle-Utils v{packageFile.version}
        </span>
    </div>
    <div class="bar files">
        {#each files as file}
            <button
                onclick={() => (focusedFile = file)}
                class="base {file === focusedFile ? 'focused' : ''}"
            >
                {file.name}
            </button>
        {/each}
    </div>
    <input bind:this={fileInput} type="file" onchange={fileSelected} />
    <div class="viewport">
        {#if focusedFile}
            <ViewFile file={focusedFile.file}></ViewFile>
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
