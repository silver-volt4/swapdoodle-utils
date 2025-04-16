import init, { decompress, parse_letter as pl } from "./wasm/parsing_wasm";

await init();

export type Letter = {
    "thumbnails": number[][],
    "sender_mii": any, // I'll deal with this later, having a URL instead could be nice
};

// Wrapper to get rid of the `any` type
const parse_letter = (bytes: Uint8Array): Letter => pl(bytes);

export { decompress, parse_letter };
