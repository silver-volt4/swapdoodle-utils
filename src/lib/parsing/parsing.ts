import init, {
    decompress,
    parse_letter,
    type JsLetter as Letter,
    type Sheet,
    type SheetStroke
} from "./wasm/parsing_wasm";

await init();

export {decompress, parse_letter, type Letter, type Sheet, type SheetStroke};
