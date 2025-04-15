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

function readString(offset: number, data: DataView, limit: number = Infinity): string {
    let name = "";
    for (let i = 0; i < limit; i++) {
        let char = data.getUint8(offset + i);
        if (char == 0) break;
        name += String.fromCharCode(char);
    }
    return name;
}

abstract class BPK1File {
    public data: DataView
    public readonly blocks: Map<string, ArrayBufferLike> = new Map();

    constructor(file: ArrayBufferLike) {
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

        this.data = data;
    }

    protected process() {
        let blocks = this.data.getUint32(4, true);
        console.info(`BPK1: Read ${blocks} blocks`);
        let pos = 0x40;

        let occurrences: { [key: string]: number } = {};

        for (let _ = 0; _ < blocks; _++) {
            let offset = this.data.getUint32(pos, true);
            pos += 4;
            let size = this.data.getUint32(pos, true);
            pos += 4;
            let checksum = this.data.getUint32(pos, true);
            pos += 4;
            let blockName = readString(pos, this.data);
            pos += 8;

            occurrences[blockName] ??= -1;
            occurrences[blockName] += 1;

            let dataSlice = this.data.buffer.slice(offset, offset + size);
            this.blocks.set(`${blockName}$${occurrences[blockName]}`, dataSlice);
            this.processBlock(blockName, dataSlice);
        }
    }

    protected abstract processBlock(blockName: string, data: ArrayBufferLike): void;
}


export class Letter extends BPK1File {
    public thumbnails: Blob[] = [];
    public sender?: MiiData
    public stationery?: Stationery

    constructor(file: ArrayBufferLike) {
        super(file);
        this.process();
    }

    protected processBlock(blockName: string, data: ArrayBufferLike) {
        console.info(`Letter: Process block ${blockName}`)

        if (blockName == "THUMB2") {
            this.thumbnails.push(
                new Blob([new Uint8Array(data)], { type: "image/jpeg" })
            );
        }

        else if (blockName == "MIISTD1") {
            this.sender = miiFileRead(
                new Uint8Array(data)
            );
        }

        else if (blockName == "STATIN1") {
            this.stationery = new Stationery(data);
        }
    }
}

export class Stationery extends BPK1File {
    name?: string;
    image: Blob[] = [];
    //mask?: Blob;

    constructor(file: ArrayBufferLike) {
        super(file);
        this.process();
    }

    protected processBlock(blockName: string, data: ArrayBufferLike) {
        console.info(`Stationery: Process block ${blockName}`)

        if (blockName === "STAHED1") {
            this.name = readString(0, new DataView(data), 0x80)
        }
        else if (blockName === "STBARD1") {
            this.image.push(
                new Blob([new Uint8Array(data)], { type: "image/jpeg" })
            )
        }
        else if (blockName === "STMASK1") {
            // will be added with the rust rewrite
        }
    }
}