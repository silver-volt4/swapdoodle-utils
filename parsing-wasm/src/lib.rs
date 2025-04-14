use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompress(bytes: &[u8]) -> Vec<u8> {
    parsing::lzss::decompress_from_slice(bytes).unwrap()
}
