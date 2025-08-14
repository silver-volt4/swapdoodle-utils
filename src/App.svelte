<script lang="ts">
    import packageFile from "../package.json";
    import Toast from "./components/Toast.svelte";
    import ViewFile from "./viewer/ViewFile.svelte";
    import Dialog from "./components/Dialog.svelte";
    import {
        askForFile,
        files,
        openNewFile,
        type OpenFile,
        getCurrentFile,
        setCurrentFile,
    } from "./lib/files.svelte";
    import { mdiOpenInNew } from "@mdi/js";
    import Icon from "@jamescoyle/svelte-icon";

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
<div
    class="w-dvw h-dvh flex flex-col bg-zinc-50"
    ondragover={dragOver}
    ondrop={drop}
>
    <!-- Open files -->
    <div class="flex w-full bg-green-700 text-white shadow-md z-10">
        <button
            onclick={fileOpen}
            class="btn p-2 transition flex shrink-0 gap-2 bg-green-700 hover:bg-green-900 border-e-2 border-green-950"
        >
            <Icon path={mdiOpenInNew} type="mdi" color="white"></Icon>

            Open file
        </button>
        <div class="flex overflow-x-scroll grow">
            {#each files as file}
                <button
                    onclick={() => setCurrentFile(file)}
                    class="btn p-2 transition {getCurrentFile() === file
                        ? 'border-solid border-b-2 border-white bg-green-600'
                        : 'hover:bg-green-900'}"
                >
                    {file.name}
                </button>
            {/each}
        </div>
    </div>

    <!-- Viewer -->
    <div class="flex flex-col grow overflow-y-auto">
        {#if getCurrentFile()}
            <ViewFile file={getCurrentFile()!.file}></ViewFile>
        {:else}
            <button
                class="bg-green-100 w-full grow flex flex-col justify-center self-center items-center"
                onclick={fileOpen}
            >
                <h1 class="font-bold text-6xl">Swapdoodle Utils</h1>
                <p class="mb-4">version: {packageFile.version}</p>
                <p class="text-lg">
                    Click here or drag a file onto this page to open it
                </p>
            </button>
        {/if}
    </div>
</div>

<Toast></Toast>
<Dialog></Dialog>
