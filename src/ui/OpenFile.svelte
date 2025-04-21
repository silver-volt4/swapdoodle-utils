<script lang="ts">
    let {
        onfileaccepted,
    }: {
        onfileaccepted: (content: File) => any;
    } = $props();
    let fileInput: HTMLInputElement = $state()!;

    function dragOver(e: Event) {
        e.preventDefault();
    }

    function fileOpen() {
        fileInput.click();
    }

    function fileSelected(e: Event) {
        let file = (e.target as HTMLInputElement | null)?.files?.[0];
        if (file) {
            onfileaccepted(file);
        }
    }
</script>

<div class="open-file">
    <button class="target" onclick={fileOpen}>
        <h1>Swapdoodle File Viewer</h1>
        <p>Click here or drag a file onto this page to open it</p>
    </button>
</div>
<input bind:this={fileInput} type="file" onchange={fileSelected} />

<style>
    .open-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        justify-content: center;
    }

    .target {
        padding: 2em;
        border: dashed 4px green;
        border-radius: 2em;
        background: none;
        cursor: pointer;
        font-size: 125%;
    }

    input {
        display: none;
    }
</style>
