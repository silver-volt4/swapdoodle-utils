/**
 * 3DS Mii data to Mii Studio data converter
 * Adapted from https://github.com/kazuki-4ys/kazuki-4ys.github.io/blob/master/web_apps/MiiInfoEditorCTR/mii.js
 */

const MII_NAME_LENGTH = 10;

export type MiiData = {
    name: string,
    creator: string,
    studioData: string
}

export function miiFileRead(buf: Uint8Array): MiiData {
    let tmpU32, tmpU16;
    let studioData = new Uint8Array([0x08, 0x00, 0x40, 0x03, 0x08, 0x04, 0x04, 0x02, 0x02, 0x0c, 0x03, 0x01, 0x06, 0x04, 0x06, 0x02, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x04, 0x00, 0x0a, 0x01, 0x00, 0x21, 0x40, 0x04, 0x00, 0x02, 0x14, 0x03, 0x13, 0x04, 0x17, 0x0d, 0x04, 0x00, 0x0a, 0x04, 0x01, 0x09])

    studioData[0x16] = buf[0x18] & 1;
    studioData[0x15] = (buf[0x19] >>> 2) & 0xf;
    studioData[0x1E] = buf[0x2e];
    studioData[2] = buf[0x2f];
    studioData[0x13] = (buf[0x30] >>> 1) & 0xF;
    studioData[0x11] = buf[0x30] >>> 5;
    studioData[0x14] = buf[0x31] & 0xF;
    studioData[0x12] = buf[0x31] >>> 4;
    studioData[0x1D] = buf[0x32];
    studioData[0x1B] = buf[0x33] & 7;
    if (!studioData[0x1B]) studioData[0x1B] = 8;
    studioData[0x1C] = (buf[0x33] >>> 3) & 1;

    tmpU32 = bufToUint32(buf, 0x34);
    studioData[7] = tmpU32 & 0x3F;
    studioData[4] = ((tmpU32 >>> 6) & 7) + 8;
    studioData[6] = (tmpU32 >>> 9) & 0xF;
    studioData[3] = (tmpU32 >>> 13) & 7;
    studioData[5] = (tmpU32 >>> 16) & 0x1F;
    studioData[8] = (tmpU32 >>> 21) & 0xF;
    studioData[9] = (tmpU32 >>> 25) & 0x1F;

    tmpU32 = bufToUint32(buf, 0x38);
    studioData[0xE] = tmpU32 & 0x1F;
    studioData[0xB] = (tmpU32 >>> 5) & 7;
    if (!studioData[0xB]) studioData[0xB] = 8;
    studioData[0xD] = (tmpU32 >>> 8) & 0xF;
    studioData[0xA] = (tmpU32 >>> 12) & 7;
    studioData[0xC] = (tmpU32 >>> 16) & 0xF;
    studioData[0xF] = (tmpU32 >>> 21) & 0xF;
    studioData[0x10] = (tmpU32 >>> 25) & 0x1F;

    tmpU16 = bufToUint16(buf, 0x3C);
    studioData[0x2C] = tmpU16 & 0x1F;
    studioData[0x2B] = (tmpU16 >>> 5) & 0xF;
    studioData[0x2D] = (tmpU16 >>> 9) & 0x1F;

    tmpU16 = bufToUint16(buf, 0x3E);
    studioData[0x26] = tmpU16 & 0x3F;
    studioData[0x24] = 0;
    if (studioData[0x24] < 4) {
        studioData[0x24] += 19;
    } else {
        studioData[0x24] = 0;
    }
    studioData[0x25] = (tmpU16 >>> 9) & 0xF;
    studioData[0x23] = (tmpU16 >>> 13) & 7;

    tmpU16 = bufToUint16(buf, 0x40);
    studioData[0x27] = tmpU16 & 0x1F;
    studioData[0x29] = (tmpU16 >>> 5) & 7;

    tmpU16 = bufToUint16(buf, 0x42);
    studioData[1] = tmpU16 & 7;
    studioData[0] = (tmpU16 >>> 3) & 7;
    if (!studioData[0]) studioData[0] = 8;
    studioData[0x28] = (tmpU16 >>> 6) & 0xF;
    studioData[0x2A] = (tmpU16 >>> 10) & 0x1F;


    tmpU16 = bufToUint16(buf, 0x44);
    studioData[0x19] = tmpU16 & 0xF;
    studioData[0x17] = (tmpU16 >>> 4) & 7;
    if (!studioData[0x17]) {
        studioData[0x17] = 8;
    } else if (studioData[0x17] < 6) {
        studioData[0x17] += 13;
    } else {
        studioData[0x17] = 0;
    }
    studioData[0x18] = (tmpU16 >>> 7) & 0xF;
    studioData[0x1A] = (tmpU16 >>> 11) & 0x1F;

    tmpU16 = bufToUint16(buf, 0x46);
    studioData[0x20] = tmpU16 & 1;
    studioData[0x1F] = (tmpU16 >>> 1) & 0xF;
    studioData[0x21] = (tmpU16 >>> 5) & 0x1F;
    studioData[0x22] = (tmpU16 >>> 10) & 0x1F;

    let miiName = bufToMiiString(buf, 0x1A);
    let creatorName = bufToMiiString(buf, 0x48);
    return {
        name: miiName,
        creator: creatorName,
        studioData: encodeStudio(studioData)
    }
}

function encodeStudio(studio: Uint8Array): string {
    let n = 0;
    let eo;
    let dest = byteToString(n);
    for (let i = 0; i < studio.length; i++) {
        eo = (7 + (studio[i] ^ n)) & 0xFF;
        n = eo;
        dest += byteToString(eo);
    }
    return dest;
}


function bufToUint16(data: Uint8Array, addr: number) {
    return (data[addr + 1] << 8) + data[addr];
}

function bufToUint32(data: Uint8Array, addr: number) {
    return (data[addr + 3] << 24) + (data[addr + 2] << 16) + (data[addr + 1] << 8) + data[addr];
}

function bufToMiiString(data: Uint8Array, addr: number) {
    let s = '';
    for (let i = 0; i < MII_NAME_LENGTH; i++) {
        let tmpU16 = bufToUint16(data, addr + i * 2);
        if (tmpU16 === 0) break;
        s += String.fromCharCode(tmpU16);
    }
    return s;
}

function byteToString(byte: number): string {
    let str = byte.toString(16);
    if (str.length < 2) str = '0' + str;
    return str;
}