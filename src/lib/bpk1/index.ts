import "./lzss"
import decompress from "./lzss";
import { miiFileRead, type MiiData } from "./miidata";

class BPK1Error extends Error {
    constructor(message: string) {
        super("BPK1: " + message);
    }
}

// ASCII BPK1
const MAGIC_BPK1 = 827019330;

export class BPK1File {
    public thumbnails: Blob[] = [];
    public sender?: MiiData
    public data: DataView

    constructor(file: ArrayBuffer) {
        let data = new DataView<ArrayBufferLike>(file);
        let magic = data.getUint32(0, true);

        if (magic !== MAGIC_BPK1) {
            // Try lzss
            try {
                console.warn("BPK1: Magic mismatched, trying to decompress the file")
                data = new DataView(decompress(new Uint8Array(file)).buffer);
                console.info("BPK1: Decompress successful");
            }
            catch {
                throw new BPK1Error(`Cannot extract: Bad magic (got ${magic})`);
            }
            magic = data.getUint32(0, true);
            if (magic !== MAGIC_BPK1) {
                throw new BPK1Error(`Cannot extract: Bad magic (got ${magic})`);
            }
        }

        let blocks = data.getUint32(4, true);
        console.info(`BPK1: Read ${blocks} blocks`);
        let pos = 0x40;

        for (let _ = 0; _ < blocks; _++) {
            let offset = data.getUint32(pos, true);
            pos += 4;
            let size = data.getUint32(pos, true);
            pos += 4;
            let checksum = data.getUint32(pos, true);
            pos += 4;
            let blockName = this.readBlockName(pos, data);
            pos += 8;
            this.processBlock(blockName, data.buffer.slice(offset, offset + size));
        }

        this.data = data;
    }

    private readBlockName(offset: number, data: DataView): string {
        let name = "";
        for (let i = 0; i < 8; i++) {
            let char = data.getUint8(offset + i);
            if (char == 0) break;
            name += String.fromCharCode(char);
        }
        return name;
    }

    private processBlock(blockName: string, data: ArrayBufferLike) {
        console.info(`BPK1: Process block ${blockName}`)
        if (blockName == "THUMB2") {
            this.thumbnails.push(
                new Blob([new Uint8Array(data)], { type: "image/jpeg" })
            );
        }
        if (blockName == "MIISTD1") {
            this.sender = miiFileRead(
                new Uint8Array(data)
            );
        }
    }
}