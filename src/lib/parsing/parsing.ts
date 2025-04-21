import init, { decompress, parse_letter } from "./wasm/parsing_wasm";

await init();

export { decompress, parse_letter };
