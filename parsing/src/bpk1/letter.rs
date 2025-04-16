use serde::Serialize;

use crate::{
    error::GenericResult,
    mii_data::{MiiData, MiiDataBytes},
    read::ReadExt,
};

use super::{BPK1Block, BPK1File};

#[derive(Debug, Serialize)]
pub struct Letter {
    // Using Box<[u8]> here as a "non-resizable binary blob" since we don't exactly need to *touch* this data
    pub thumbnails: Vec<Box<[u8]>>,
    pub sender_mii: Option<MiiData>,
    pub stationery: Option</* Stationery */ ()>,
}

impl BPK1File for Letter {
    fn new_from_bpk1_blocks(blocks: Vec<BPK1Block>) -> GenericResult<Self> {
        let mut thumbnails = vec![];
        let mut sender_mii = None;
        let mut stationery = None;

        for block in blocks {
            // Apparently you can't cleanly match against CString; so I'll just use a byte string. Essentially identical
            match block.name.to_bytes() {
                b"THUMB2" => {
                    thumbnails.push(block.data.into_boxed_slice());
                }
                b"MIISTD1" => {
                    let mut slice: &[u8] = &block.data;
                    sender_mii = Some(MiiData::from_bytes(slice.read_const_num_of_bytes()?)?)
                }
                b"STATIN1" => {}
                _ => {}
            }
        }

        Ok(Letter {
            thumbnails,
            sender_mii,
            stationery,
        })
    }
}

#[cfg(test)]
pub mod tests {
    use std::fs::read;

    use chrono::{DateTime, Utc};

    use super::*;

    #[test]
    fn test_de() {
        // using read instead of include_bytes so it fails at runtime if the test case isn't present instead of not compiling
        let letter =
            dbg!(Letter::new_from_bpk1_bytes(&read("test_cases/letter.bpk").unwrap()).unwrap());
        let mii = letter.sender_mii.unwrap();
        println!("Mii: {:#?}", mii);
        let datetime: DateTime<Utc> = mii.mii_creation_date.into();
        println!("Creation date: {} UTC", datetime.format("%d/%m/%Y %T"));
        println!("{}", mii.get_mii_studio_url());
    }
}
