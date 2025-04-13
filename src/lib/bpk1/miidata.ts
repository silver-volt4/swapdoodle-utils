const CTR_MII_FILE_SIZE = 0x5C;
const MII_NAME_LENGTH = 10;
const CONSOLE_ID_LENGTH = 0x8;
const MII_ID_LENGTH = 0x4;
const MAC_ADDR_LENGTH = 0x6;

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

export function miiFileRead(buf: Uint8Array) {
    let tmpU32, tmpU16;
    if (buf.length === CTR_MII_FILE_SIZE) {
        editMii.unknown = buf[0];
        editMii.allowCopying = getBoolean(buf[0x1] & 1);
        editMii.profanityFlag = getBoolean((buf[0x1] >>> 1) & 1);
        editMii.regionLock = (buf[0x1] >>> 2) & 3;
        editMii.characterSet = (buf[0x1] >>> 4) & 3;
        editMii.pageIndex = buf[0x2] & 0xf;
        editMii.slotIndex = (buf[0x2] >>> 4) & 0xf;
        editMii.version = (buf[0x3] >>> 4) & 0x7;
        for (let i = 0; i < CONSOLE_ID_LENGTH; i++) {
            editMii.consoleID[i] = buf[0x4 + i];
        }
        for (let i = 0; i < MII_ID_LENGTH; i++) {
            editMii.miiID[i] = buf[0xc + i];
        }
        for (let i = 0; i < MAC_ADDR_LENGTH; i++) {
            editMii.creatorMAC[i] = buf[0x10 + i];
        }
        editMii.isGirl = getBoolean(buf[0x18] & 1);
        editMii.month = (buf[0x18] >>> 1) & 0xf;
        editMii.day = ((buf[0x19] & 3) << 3) + (buf[0x18] >>> 5);
        editMii.favColor = (buf[0x19] >>> 2) & 0xf;
        editMii.isFavorite = getBoolean((buf[0x19] >>> 6) & 1);
        editMii.name = bufToUTF16String(buf, 0x1A, MII_NAME_LENGTH, true);
        editMii.height = buf[0x2e];
        editMii.weight = buf[0x2f];
        editMii.sharing = !(getBoolean(buf[0x30] & 1));
        editMii.faceShape = (buf[0x30] >>> 1) & 0xF;
        editMii.skinColor = buf[0x30] >>> 5;
        editMii.wrinkles = buf[0x31] & 0xF;
        editMii.makeup = buf[0x31] >>> 4;
        editMii.hairStyle = buf[0x32];
        editMii.hairColor = buf[0x33] & 7;
        editMii.flipHair = (buf[0x33] >>> 3) & 1;
        tmpU32 = bufToUint32(buf, 0x34, true);
        editMii.eyeStyle = tmpU32 & 0x3F;
        editMii.eyeColor = (tmpU32 >>> 6) & 7;
        editMii.eyeScale = (tmpU32 >>> 9) & 0xF;
        editMii.eyeYscale = (tmpU32 >>> 13) & 7;
        editMii.eyeRotation = (tmpU32 >>> 16) & 0x1F;
        editMii.eyeXspacing = (tmpU32 >>> 21) & 0xF;
        editMii.eyeYposition = (tmpU32 >>> 25) & 0x1F;
        tmpU32 = bufToUint32(buf, 0x38, true);
        editMii.eyebrowStyle = tmpU32 & 0x1F;
        editMii.eyebrowColor = (tmpU32 >>> 5) & 7;
        editMii.eyebrowScale = (tmpU32 >>> 8) & 0xF;
        editMii.eyebrowYscale = (tmpU32 >>> 12) & 7;
        editMii.eyebrowRotation = (tmpU32 >>> 16) & 0xF;
        editMii.eyebrowXspacing = (tmpU32 >>> 21) & 0xF;
        editMii.eyebrowYposition = (tmpU32 >>> 25) & 0x1F;
        tmpU16 = bufToUint16(buf, 0x3C, true);
        editMii.noseStyle = tmpU16 & 0x1F;
        editMii.noseScale = (tmpU16 >>> 5) & 0xF;
        editMii.noseYposition = (tmpU16 >>> 9) & 0x1F;
        tmpU16 = bufToUint16(buf, 0x3E, true);
        editMii.mouseStyle = tmpU16 & 0x3F;
        editMii.mouseColor = (tmpU16 >>> 6) & 7;
        editMii.mouseScale = (tmpU16 >>> 9) & 0xF;
        editMii.mouseYscale = (tmpU16 >>> 13) & 7;
        tmpU16 = bufToUint16(buf, 0x40, true);
        editMii.mouseYposition = tmpU16 & 0x1F;
        editMii.mustacheStyle = (tmpU16 >>> 5) & 7;
        tmpU16 = bufToUint16(buf, 0x42, true);
        editMii.beardStyle = tmpU16 & 7;
        editMii.beardColor = (tmpU16 >>> 3) & 7;
        editMii.mustacheScale = (tmpU16 >>> 6) & 0xF;
        editMii.mustacheYposition = (tmpU16 >>> 10) & 0x1F;
        tmpU16 = bufToUint16(buf, 0x44, true);
        editMii.glassesStyle = tmpU16 & 0xF;
        editMii.glassesColor = (tmpU16 >>> 4) & 7;
        editMii.glassesScale = (tmpU16 >>> 7) & 0xF;
        editMii.glassesYposition = (tmpU16 >>> 11) & 0x1F;
        tmpU16 = bufToUint16(buf, 0x46, true);
        editMii.enableMole = tmpU16 & 1;
        editMii.moleScale = (tmpU16 >>> 1) & 0xF;
        editMii.moleXposition = (tmpU16 >>> 5) & 0x1F;
        editMii.moleYposition = (tmpU16 >>> 10) & 0x1F;
        editMii.creatorName = bufToUTF16String(buf, 0x48, MII_NAME_LENGTH, true);
    }

    let studioData = new Uint8Array([0x08, 0x00, 0x40, 0x03, 0x08, 0x04, 0x04, 0x02, 0x02, 0x0c, 0x03, 0x01, 0x06, 0x04, 0x06, 0x02, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x04, 0x00, 0x0a, 0x01, 0x00, 0x21, 0x40, 0x04, 0x00, 0x02, 0x14, 0x03, 0x13, 0x04, 0x17, 0x0d, 0x04, 0x00, 0x0a, 0x04, 0x01, 0x09])

    studioData[0x16] = getInt(editMii.isGirl);
    studioData[0x15] = editMii.favColor;
    studioData[0x1E] = editMii.height;
    studioData[2] = editMii.weight;
    studioData[0x13] = editMii.faceShape;
    studioData[0x11] = editMii.skinColor;
    studioData[0x14] = editMii.wrinkles;
    studioData[0x12] = editMii.makeup;
    studioData[0x1D] = editMii.hairStyle;
    studioData[0x1B] = editMii.hairColor;
    if (!studioData[0x1B]) studioData[0x1B] = 8;
    studioData[0x1C] = editMii.flipHair;
    studioData[7] = editMii.eyeStyle;
    studioData[4] = editMii.eyeColor + 8;
    studioData[6] = editMii.eyeScale;
    studioData[3] = editMii.eyeYscale;
    studioData[5] = editMii.eyeRotation;
    studioData[8] = editMii.eyeXspacing;
    studioData[9] = editMii.eyeYposition;
    studioData[0xE] = editMii.eyebrowStyle;
    studioData[0xB] = editMii.eyebrowColor;
    if (!studioData[0xB]) studioData[0xB] = 8;
    studioData[0xD] = editMii.eyebrowScale;
    studioData[0xA] = editMii.eyebrowYscale;
    studioData[0xC] = editMii.eyebrowRotation;
    studioData[0xF] = editMii.eyebrowXspacing;
    studioData[0x10] = editMii.eyebrowYposition;
    studioData[0x2C] = editMii.noseStyle;
    studioData[0x2B] = editMii.noseScale;
    studioData[0x2D] = editMii.noseYposition;
    studioData[0x26] = editMii.mouseStyle;
    studioData[0x24] = editMii.mouseColor;
    if (studioData[0x24] < 4) {
        studioData[0x24] += 19;
    } else {
        studioData[0x24] = 0;
    }
    studioData[0x25] = editMii.mouseScale;
    studioData[0x23] = editMii.mouseYscale;
    studioData[0x27] = editMii.mouseYposition;
    studioData[0x29] = editMii.mustacheStyle;
    studioData[1] = editMii.beardStyle;
    studioData[0] = editMii.beardColor;
    if (!studioData[0]) studioData[0] = 8;
    studioData[0x28] = editMii.mustacheScale;
    studioData[0x2A] = editMii.mustacheYposition;
    studioData[0x19] = editMii.glassesStyle;
    studioData[0x17] = editMii.glassesColor;
    if (!studioData[0x17]) {
        studioData[0x17] = 8;
    } else if (studioData[0x17] < 6) {
        studioData[0x17] += 13;
    } else {
        studioData[0x17] = 0;
    }
    studioData[0x18] = editMii.glassesScale;
    studioData[0x1A] = editMii.glassesYposition;
    studioData[0x20] = editMii.enableMole;
    studioData[0x1F] = editMii.moleScale;
    studioData[0x21] = editMii.moleXposition;
    studioData[0x22] = editMii.moleYposition;

    return encodeStudio(studioData);
}

function getBoolean(int) {
    if (int === 1) return true;
    return false;
}

function getInt(boolean: Boolean) {
    if (boolean === true) return 1;
    return 0;
}

function bufToUint16(data, addr, isLE) {
    if (isLE) return (data[addr + 1] << 8) + data[addr];
    return (data[addr] << 8) + data[addr + 1];
}

function bufToUint32(data, addr, isLE) {
    if (isLE) return (data[addr + 3] << 24) + (data[addr + 2] << 16) + (data[addr + 1] << 8) + data[addr];
    return (data[addr] << 24) + (data[addr + 1] << 16) + (data[addr + 2] << 8) + data[addr + 3];
}


function bufToUTF16String(data, addr, length, isLE) {
    let s = '';
    let tmpU16;
    for (let i = 0; i < length; i++) {
        tmpU16 = bufToUint16(data, addr + i * 2, isLE);
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