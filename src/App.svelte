<script lang="ts">
    import { type Letter, parse_letter } from "./lib/parsing/parsing";

    let reader: Promise<Letter> | undefined = $state();

    function fileSelected(e: Event) {
        reader = new Promise<Letter>((resolve, reject) => {
            let file = (e.target as HTMLInputElement | null)?.files?.[0];
            if (!file) {
                reject("Cannot load file");
                return;
            }

            let reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = (readerEvent) => {
                let content = readerEvent.target?.result as ArrayBuffer | null;
                if (!content) {
                    reject("Cannot read file content");
                    return;
                }
                const letter = parse_letter(new Uint8Array(content));
                console.log(letter);
                resolve(letter);
            };
        });
    }

    function download(data: DataView) {
        var bb = new Blob([data], { type: "application/octet-stream" });
        var a = document.createElement("a");
        a.download = "letter.bin";
        a.href = window.URL.createObjectURL(bb);
        a.click();
    }
</script>

<input type="file" onchange={fileSelected} />

<div>
    {#if reader}
        {#await reader then file}
            <button onclick={() => download(file.data)}>download</button>
            <div class="sector">
                <h1>Thumbnails</h1>
                <div class="thumbs">
                    {#each file.thumbnails as thumbnail, i}
                        {@const title = `Thumbnail no. ${i + 1}`}
                        <div class="thumb">
                            <p>
                                <b>{title}</b>
                            </p>
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt={title}
                            />
                        </div>
                    {/each}
                </div>
            </div>

            <div class="sector">
                <div class="mii">
                    <h1>Sender's Mii</h1>
                    <p>Mii Name: {file.sender?.name}</p>
                    <p>Mii creator's name: {file.sender?.creator}</p>
                    <img
                        src="https://studio.mii.nintendo.com/miis/image.png?data={file
                            .sender?.studioData}&width=128&type=face"
                        alt=""
                    />
                </div>
            </div>

            <div class="sector">
                <div class="">
                    <h1>Stationery</h1>
                    <p>Name: {file.stationery?.name}</p>
                    <div class="thumbs">
                        {#each file.stationery?.image ?? [] as stationery}
                            <img
                                src={URL.createObjectURL(stationery)}
                                alt={""}
                            />
                        {/each}
                    </div>
                </div>
            </div>
        {/await}
    {/if}
</div>

<style>
    .sector {
        border: solid 1px black;
    }

    .thumbs {
        display: flex;
        gap: 10px;
    }

    .thumb img {
        height: 128px;
        width: 128px;
    }

    .mii img {
        height: 64px;
        width: 64px;
    }
</style>
