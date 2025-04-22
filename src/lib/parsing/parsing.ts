import init, {
    init2,
    decompress,
    parse_letter,
    decompress_if_compressed,
    type JsLetter as Letter,
    type Sheet,
    type SheetStroke,
    type Colors,
    type JsStationery as Stationery
} from "./wasm/parsing_wasm";

await init();
init2();

export { decompress, decompress_if_compressed, parse_letter, type Letter, type Sheet, type SheetStroke, type Colors, type Stationery };
