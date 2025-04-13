import init, { decompress } from "./lzss/lzss_wasm";

await init();

export default decompress;
