<script lang="ts">
    import { parse_letter, type Letter } from "./lib/parsing/parsing";
    import OpenFile from "./ui/OpenFile.svelte";
    import ViewFile from "./ui/ViewFile.svelte";

    function dragOver(e: Event) {
        e.preventDefault();
    }

    function drop(e: DragEvent) {
        e.preventDefault();

        let file = e.dataTransfer?.files[0];
        if (file) {
            readFile(file);
        }
    }

    function readFile(file: File) {
        let reader = new FileReader();
        reader.onload = (readerEvent) => {
            let content = readerEvent.target?.result as ArrayBuffer | null;
            if (!content) {
                return;
            }
            letterData = new Uint8Array(content);
            letter = parse_letter(letterData);
            console.log(letter);
        };

        reader.readAsArrayBuffer(file);
    }

    let letterData: Uint8Array | undefined = $state.raw();
    let letter: Letter | undefined = $state.raw();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="root" ondragover={dragOver} ondrop={drop}>
    {#if !(letter && letterData)}
        <OpenFile onfileaccepted={(file) => readFile(file)} />
    {:else}
        <ViewFile {letter} {letterData}></ViewFile>
    {/if}
</div>

<style>
    .root {
        min-height: 100vh;
    }
</style>
