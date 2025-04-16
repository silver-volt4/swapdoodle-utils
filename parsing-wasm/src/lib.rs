use parsing::bpk1::{BPK1File, letter::Letter};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompress(bytes: &[u8]) -> Vec<u8> {
    parsing::lzss::decompress_from_slice(bytes).unwrap()
}

#[wasm_bindgen]
pub fn parse_letter(bytes: &[u8]) -> JsValue {
    serde_wasm_bindgen::to_value(&Letter::new_from_bpk1_bytes(bytes).unwrap()).unwrap()
}
