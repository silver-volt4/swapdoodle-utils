<script lang="ts">
    import { Letter } from "../lib/bpk1";

    let {
        letter: letter,
    }: {
        letter: Letter;
    } = $props();

    function download() {
        let blob = new Blob([letter.data], {
            type: "application/octet-stream",
        });
        let a = document.createElement("a");
        a.download = "letter.bin";
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }
</script>

<div class="file">
    <div class="header">
        <div class="title">
            Swapdoodle file viewer
        </div>
        <button onclick={download}>Save letter (decrypted)</button>
    </div>

    <div class="card">
        <div class="card-header">Thumbnails</div>
        <div class="gallery">
            {#each letter.thumbnails as thumbnail, i}
                {@const title = `Thumbnail no. ${i + 1}`}
                <div>
                    <p>
                        <b>{title}</b>
                    </p>
                    <img
                        class="thumbnail"
                        src={URL.createObjectURL(thumbnail)}
                        alt={title}
                    />
                </div>
            {/each}
        </div>
    </div>

    <div class="card">
        <div class="card-header">Sender</div>
        <div class="mii">
            <img
                class="mii"
                src="https://studio.mii.nintendo.com/miis/image.png?data={letter
                    .sender?.studioData}&width=128&type=face"
                alt=""
            />
            <div class="name">
                {letter.sender?.name}
                {#if letter.sender?.creator}
                    (mii by: {letter.sender?.creator})
                {/if}
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">Stationery</div>
        <p>Name: {letter.stationery?.name}</p>
        <div class="gallery">
            {#each letter.stationery?.image ?? [] as stationery}
                <img src={URL.createObjectURL(stationery)} alt={""} />
            {/each}
        </div>
    </div>
</div>

<style>
    .file {
        padding: 1em;
    }

    .card-header {
        background-color: white;
        margin: -1em;
        margin-bottom: 1em;
        padding: 0.5em 1em;
    }

    .card {
        background-color: rgba(255, 255, 255, 0.4);
        box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
        padding: 1em;
        margin-bottom: 1em;
        font-size: 18px;
    }

    .gallery {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    img.thumbnail {
        height: 128px;
        width: 128px;
    }

    .mii {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
    }

    .mii .name {
        font-size: 120%;
    }

    .mii img {
        height: 96px;
        width: 96px;
        background-color: white;
        border-radius: 50%;
    }

    button {
        padding: 0.5em 1em;
        margin-bottom: 1em;
        background-color: white;
        border: none;
        box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
        cursor: pointer;
        font-size: 18px;
    }

    .header {
        display: flex;
        align-items: center;
        margin-bottom: 1em;
        justify-content: space-between;
    }

    .header .title {
        font-size: 32px;
        font-weight: bold;
    }

    .header button {
        margin-bottom: 0;
    }
</style>
