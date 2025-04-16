use std::{error::Error, fmt::Display, io::Cursor};

use crate::{bits::PickBit, read::ReadExt};

pub struct Sheet {
    pub strokes: Vec<SheetStroke>,
}

#[derive(Debug)]
pub struct SheetStroke {
    pub x: u8,
    pub y: u8,
    pub draw_line: bool,
    pub style_color: u8,
    pub style_3d: bool,
    pub style_bold: bool,
}

#[derive(Debug)]
pub enum SheetStrokeDeserializeError {
    InvalidFormat,
}

impl Display for SheetStrokeDeserializeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use SheetStrokeDeserializeError::*;
        match self {
            InvalidFormat => write!(f, "Invalid format"),
        }
    }
}

impl Error for SheetStrokeDeserializeError {}

pub type SheetDataBytes = Vec<u8>;

impl Sheet {
    pub fn from_bytes(bytes: SheetDataBytes) -> Result<Self, SheetStrokeDeserializeError> {
        Self::try_from(bytes)
    }
}

impl SheetStroke {
    pub fn from_bytes(bytes: [u8; 4]) -> SheetStroke {
        SheetStroke {
            x: (bytes[2] & 0x0F) << 4 + (bytes[1] & 0xF0) >> 4,
            y: (bytes[1] & 0x0F) << 4 + (bytes[0] & 0xF0) >> 4,
            draw_line: bytes[2].pick_bit(6),
            style_color: bytes[3] & 0b00000111,
            style_3d: bytes[3].pick_bit(5),
            style_bold: bytes[3].pick_bit(4),
        }
    }
}

impl TryFrom<SheetDataBytes> for Sheet {
    type Error = SheetStrokeDeserializeError;

    fn try_from(value: SheetDataBytes) -> Result<Self, Self::Error> {
        let mut reader = Box::new(Cursor::new(value));
        let _ = reader.read_u32_le();
        let num_blocks = reader.read_u32_le().unwrap();
        reader.set_position(0x40);

        let mut sheet: Sheet = Sheet { strokes: vec![] };

        for _ in 0..num_blocks {
            sheet.strokes.push(SheetStroke::from_bytes(
                reader.read_const_num_of_bytes::<4>().unwrap(),
            ));
        }

        Ok(sheet)
    }
}
