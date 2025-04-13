use std::io::Cursor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompress(bytes: Vec<u8>) -> Vec<u8> {
    let mut cursor = Cursor::new(bytes);
    rust_lzss::decompress(&mut cursor).unwrap()
}

#[cfg(test)]
pub mod tests {
    use super::*;

    #[test]
    fn test() {
        decompress(vec![ 0x10, 0x14, 0x00, 0x00, 0x08, 0x61, 0x62, 0x63, 0x64, 0xD0, 0x03 ]);
    }
}
