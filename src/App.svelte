<script lang="ts">
    import { parse_letter } from "./lib/parsing/parsing";
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
            letter = parse_letter(new Uint8Array(content));
            console.log(letter);
        };

        reader.readAsArrayBuffer(file);
    }

    let letter: any | undefined = $state.raw();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="root" ondragover={dragOver} ondrop={drop}>
    {#if !letter}
        <OpenFile onfileaccepted={(file) => readFile(file)} />
    {:else}
        <ViewFile {letter}></ViewFile>
    {/if}
</div>

<style>
    .root {
        min-height: 100vh;
    }
</style>
