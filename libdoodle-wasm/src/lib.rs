use std::{collections::HashMap, f64::consts::E, ffi::CString, io::Read, mem, str::FromStr};

use libdoodle::{
    blocks::{colslt1::Colors, miistd1::{MiiData, MiiDataBytes}, sheet1::Sheet}, bpk1::{BPK1Block, BPK1Blocks, BPK1File}, error::GenericResult, files::stationery::Stationery
};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;
use tsify::{Tsify, declare};
use wasm_bindgen::prelude::*;

#[declare]
pub type JsBlocksMap = HashMap<String, Vec<ByteBuf>>;

#[wasm_bindgen]
pub fn init() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn decompress(bytes: &[u8]) -> Vec<u8> {
    libdoodle::lzss::decompress_from_slice(bytes).unwrap()
}

#[wasm_bindgen]
pub fn decompress_if_compressed(bytes: &[u8]) -> Vec<u8> {
    libdoodle::lzss::decompress_from_slice(bytes).unwrap_or_else(|_| bytes.to_vec())
}

#[derive(Tsify, Debug, Serialize)]
#[tsify(into_wasm_abi)]
pub struct MiiPreview {
    pub url: String,
    pub name: String,
    pub author_name: String,
}

impl From<MiiData> for MiiPreview {
    fn from(value: MiiData) -> Self {
        MiiPreview {
            url: value.get_mii_studio_url(),
            name: value.mii_name,
            author_name: value.creator_name,
        }
    }
}

#[wasm_bindgen]
pub fn parse_bpk1(bytes: &[u8]) -> Result<Vec<BPK1Block>, JsError> {
    match BPK1Blocks::new_from_bpk1_bytes(bytes) {
        Ok(letter) => Ok(letter),
        Err(e) => Err(JsError::new(format!("{:#?}", e).as_str())),
    }
}

// TODO: surely this could be generated somehow?
// TODO: nicer errors

#[wasm_bindgen]
pub fn build_bpk1(blocks: Vec<BPK1Block>) -> Result<Vec<u8>, JsError> {
    match BPK1Blocks::bytes_from_bpk1_blocks(blocks) {
        Ok(data) => Ok(data.into()),
        Err(_) => Err(JsError::new("Failed")),
    }
}

#[wasm_bindgen]
pub fn parse_colors(block: &BPK1Block) -> Result<Colors, JsError> {
    match Colors::try_from(block.data.as_slice()) {
        Ok(letter) => Ok(letter),
        Err(e) => Err(JsError::new(format!("{:#?}", e).as_str())),
    }
}

#[wasm_bindgen]
pub fn parse_sheet(block: &BPK1Block) -> Result<Sheet, JsError> {
    match Sheet::try_from(block.data.as_slice()) {
        Ok(letter) => Ok(letter),
        Err(e) => Err(JsError::new(format!("{:#?}", e).as_str())),
    }
}

#[wasm_bindgen]
pub fn parse_stationery(block: &BPK1Block) -> Result<Stationery, JsError> {
    match Stationery::try_from(block.data.as_slice()) {
        Ok(letter) => Ok(letter),
        Err(e) => Err(JsError::new(format!("{:#?}", e).as_str())),
    }
}

fn read_mii_data(block: &BPK1Block) -> GenericResult<MiiData>{
    let mut mii_data: MiiDataBytes = [0; 0x5C];
    let mut slice: &[u8] = &block.data;
    slice.read(&mut mii_data)?;
    Ok(MiiData::try_from(mii_data)?)
}

#[wasm_bindgen]
pub fn parse_mii_data(block: &BPK1Block) -> Result<MiiPreview, JsError> {
    match read_mii_data(block) {
        Ok(letter) => Ok(letter.into()),
        Err(e) => Err(JsError::new(format!("{:#?}", e).as_str())),
    }
}