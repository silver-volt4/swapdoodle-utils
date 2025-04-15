import init, { decompress } from "./lzss/lzss_wasm";

// TODO: handle this in a neater way
init();

export default decompress;
