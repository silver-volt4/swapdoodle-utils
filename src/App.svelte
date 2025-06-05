<script lang="ts">
    import { LetterFile } from "./lib/libdoodle/libdoodle.svelte";
    import { warn } from "./lib/toast.svelte";
    import OpenFile from "./pages/OpenFile.svelte";
    import Toast from "./components/Toast.svelte";
    import ViewFile from "./pages/ViewFile.svelte";
    import Dialog from "./components/Dialog.svelte";
    import { pushDialog } from "./lib/dialog.svelte";
    import {
        encode as b64encode,
        decode as b64decode,
    } from "base64-arraybuffer";
    import { onMount } from "svelte";

    const NEW_TAB_HASH = "#transfer-file";

    function dragOver(e: Event) {
        e.preventDefault();
    }

    function drop(e: DragEvent) {
        e.preventDefault();

        if (blockFileDrag) return;

        let file = e.dataTransfer?.files[0];
        if (file) {
            readFile(file);
        }
    }

    async function readFile(file: File) {
        if (letter) {
            try {
                blockFileDrag = true;
                let result = await pushDialog({
                    title: "Open a file...",
                    message:
                        "A new file has been dragged into the application. What do you wish to do?",
                    buttons: [
                        {
                            id: "replace",
                            label: "Open",
                        },
                        {
                            id: "new-tab",
                            label: "Open in new tab",
                        },
                        {
                            id: "cancel",
                            label: "Cancel",
                        },
                    ],
                });
                if (result == "cancel") {
                    return;
                } else if (result == "new-tab") {
                    openFileInNewTab(file);
                }
            } finally {
                blockFileDrag = false;
            }
        }
        try {
            letter = await LetterFile.readFile(file);
        } catch (e) {
            let message = (e as Partial<Error>)?.message;
            warn({
                title: "Error reading file",
                message: message ?? "Unknown error",
            });
        }
    }

    async function openFileInNewTab(file: File) {
        let fileBase64 = b64encode(await file.arrayBuffer());
        localStorage.setItem("transferredFile", fileBase64);
        let openUrl = new URL(window.location.href);
        openUrl.hash = NEW_TAB_HASH;
        window.open(openUrl, "_blank");
    }

    onMount(async () => {
        if (window.location.hash == NEW_TAB_HASH) {
            let data = localStorage.getItem("transferredFile");
            if (data) {
                localStorage.removeItem("transferredFile");
                letter = await LetterFile.readUint8Array(
                    new Uint8Array(b64decode(data)),
                );
            }
            window.location.href = "#";
        }
    });

    let blockFileDrag = false;
    let letter: LetterFile | undefined = $state();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="root" ondragover={dragOver} ondrop={drop}>
    {#if !letter}
        <OpenFile onfileaccepted={(file) => readFile(file)} />
    {:else}
        <ViewFile file={letter}></ViewFile>
    {/if}
    <Toast></Toast>
    <Dialog></Dialog>
</div>

<style>
    .root {
        min-height: 100vh;
    }
</style>
