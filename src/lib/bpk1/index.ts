import "./lzss"
import { miiFileRead } from "./miidata";

class BPK1Error extends Error {
    constructor(message: string) {
        super("BPK1: " + message);
    }
}

class BPK1Thumb {

}

export class BPK1File {
    public thumbnails: Blob[] = [];

    constructor(file: ArrayBuffer) {
        let data = new DataView(file);
        let magic = data.getUint32(0, true);
        if (magic !== 827019330) { // ASCII BPK1
            throw new BPK1Error(`Cannot extract: Bad magic (got ${magic})`);
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
            this.processBlock(blockName, file.slice(offset, offset + size));
        }
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

    private processBlock(blockName: string, data: ArrayBuffer) {
        console.info(`BPK1: Process block ${blockName}`)
        if (blockName == "THUMB2") {
            this.thumbnails.push(
                new Blob([data], { type: "image/jpeg" })
            );
        }
        if (blockName == "MIISTD1") {
            console.log(miiFileRead(
                new Uint8Array(data.slice(0, 0x5C))
            ))
        }
    }
}