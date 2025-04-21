import init, {
    init2,
    decompress,
    parse_letter,
    type JsLetter as Letter,
    type Sheet,
    type SheetStroke,
    type Colors
} from "./wasm/parsing_wasm";

await init();
init2();

export { decompress, parse_letter, type Letter, type Sheet, type SheetStroke, type Colors };
