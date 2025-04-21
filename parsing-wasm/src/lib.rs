use parsing::{
    bpk1::{
        BPK1File,
        letter::{self, Letter},
    },
    sheet::Sheet,
};
use serde::Serialize;
use serde_bytes::{ByteBuf, Bytes};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompress(bytes: &[u8]) -> Vec<u8> {
    parsing::lzss::decompress_from_slice(bytes).unwrap()
}

#[derive(Tsify, Serialize)]
#[tsify(into_wasm_abi)]
pub struct JsLetter {
    pub thumbnails: Vec<ByteBuf>,
    pub sender_mii: Option<String>,
    pub sheets: Vec<Sheet>,
}

#[wasm_bindgen]
pub fn parse_letter(bytes: &[u8]) -> JsLetter {
    let letter = Letter::new_from_bpk1_bytes(bytes).unwrap();
    JsLetter {
        thumbnails: letter.thumbnails.into_iter().map(|b| b.into()).collect(),
        sender_mii: letter.sender_mii.map(|m| m.get_mii_studio_url()),
        sheets: letter.sheets,
    }
}
