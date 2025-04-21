use std::collections::HashMap;

use parsing::{
    bpk1::{BPK1File, letter::Letter},
    sheet::Sheet,
};
use serde::Serialize;
use serde_bytes::{ByteBuf, Bytes};
use tsify::Tsify;
use wasm_bindgen::prelude::*;
use parsing::color::Colors;

#[wasm_bindgen]
pub fn decompress(bytes: &[u8]) -> Vec<u8> {
    parsing::lzss::decompress_from_slice(bytes).unwrap()
}

#[derive(Tsify, Serialize)]
pub struct JsMii {
    pub url: String,
    pub name: String,
    pub author_name: String,
}

#[derive(Tsify, Serialize)]
#[tsify(into_wasm_abi)]
pub struct JsLetter {
    pub thumbnails: Vec<ByteBuf>,
    pub sender_mii: Option<JsMii>,
    pub sheets: Vec<Sheet>,
    pub blocks: HashMap<String, Vec<ByteBuf>>,
    pub colors: Option<Colors>,
}

#[wasm_bindgen]
pub fn parse_letter(bytes: &[u8]) -> JsLetter {
    let letter: Letter = Letter::new_from_bpk1_bytes(bytes).unwrap();
    JsLetter {
        thumbnails: letter.thumbnails.into_iter().map(Into::into).collect(),
        sender_mii: letter.sender_mii.map(|m| JsMii {
            url: m.get_mii_studio_url(),
            name: m.mii_name,
            author_name: m.creator_name,
        }),
        sheets: letter.sheets,
        blocks: letter
            .blocks
            .into_iter()
            .map(|(n, e)| (n, e.into_iter().map(Into::into).collect()))
            .collect(),
        colors: letter.colors
    }
}
