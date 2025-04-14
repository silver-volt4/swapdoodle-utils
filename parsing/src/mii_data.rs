use std::time::{Duration, SystemTime};

use crate::bits::PickBit;

pub struct MiiData {
    pub mii_id: u32,
    pub copying_allowed: bool,
    pub name_has_profanity: bool,
    // name: String,
    // creator: String,
    // studio_data: String,
    features: MiiFeatures,
}

pub enum MiiDeserializeError {
    UnknownVersion(u8),
    UnknownSourceDevice(u8),
    InvalidBirthdayMonth(u8),
    InvalidFavoriteColor(u8),
}

impl TryFrom<[u8; 0x5C]> for MiiData {
    type Error = MiiDeserializeError;

    fn try_from(value: [u8; 0x5C]) -> Result<Self, Self::Error> {
        let raw = MiiDataRaw::from(value);

        if raw.version != 3 {
            return Err(MiiDeserializeError::UnknownVersion(raw.version));
        };

        let copying_allowed = raw.meta_flags.pick_bit(0);
        let region_lock: MiiRegionLock = raw.meta_flags.pick_bits(2..4).try_into().unwrap();
        let name_profanity = raw.meta_flags.pick_bit(1);
        let name_character_set: MiiNameCharacterSet =
            raw.meta_flags.pick_bits(4..6).try_into().unwrap();
        let position = MiiPosition {
            page: raw.selection_position.pick_bits(0..4),
            slot: raw.selection_position.pick_bits(4..8),
        };
        let source_device = raw.source_device.pick_bits(4..7);
        let source_device: MiiSourceDevice = raw
            .source_device
            .try_into()
            .map_err(|_| MiiDeserializeError::UnknownSourceDevice(source_device))?;
        let system_id = raw.system_id;
        let mii_id = u32::from_be_bytes(raw.mii_id);
        let EPOCH = SystemTime::UNIX_EPOCH + Duration::from_secs(1262304000); // Jan 1st 2010 00:00:00
        let creation_date = EPOCH + Duration::from_secs(mii_id.pick_bits(0..28) as u64);
        let creator_mac_address = raw.creator_mac_address;

        let mii_flags = u16::from_le_bytes(raw.mii_flags);
        let mii_gender: MiiGender = (mii_flags.pick_bit(0) as u8).try_into().unwrap();
        let mii_birthday_month = mii_flags.pick_bits(1..5) as u8;
        let mii_birthday_month: chrono::Month = mii_birthday_month
            .try_into()
            .map_err(|_| MiiDeserializeError::InvalidBirthdayMonth(mii_birthday_month))?;
        let mii_birthday_day = mii_flags.pick_bits(5..10) as u8; // I'm not gonna bother checking this one...
        let favorite_color = mii_flags.pick_bits(10..14) as u8;
        let favorite_color: MiiFavoriteColor = favorite_color
            .try_into()
            .map_err(|_| MiiDeserializeError::InvalidFavoriteColor(favorite_color))?;
        let is_favorite = mii_flags.pick_bit(14);

        todo!()
        // Ok(MiiData {
        //     id: u32::from_be_bytes(raw.mii_id),
        // })
    }
}

macro_rules! n_enum {
    ($name: ident; $($i: ident = $n: expr),*) => {
        #[repr(u8)]
        pub enum $name {
            $($i = $n,)*
        }

        impl TryFrom<u8> for $name {
            type Error = ();

            fn try_from(value: u8) -> Result<Self, Self::Error> {
                use $name::*;
                Ok(match value {
                    $($n => $i,)*
                    _ => Err(())?,
                })
            }
        }
    };
}

n_enum!(
    MiiRegionLock;
    None = 0,
    Jp = 1,
    Us = 2,
    Eu = 3
);

n_enum!(
    MiiNameCharacterSet;
    JpUsEu = 0,
    Chn = 1,
    Kor = 2,
    Twn = 3
);

pub struct MiiPosition {
    pub page: u8,
    pub slot: u8,
}

n_enum!(
    MiiSourceDevice;
    Wii = 1,
    DS = 2,
    ThreeDS = 3,
    WiiUSwitch = 4
);

n_enum!(
    MiiGender;
    Male = 0,
    Female = 1
);

n_enum!(
    MiiFavoriteColor;
    Red = 0,
    Orange = 1,
    Yellow = 2,
    Lime = 3,
    Green = 4,
    DarkBlue = 5,
    Blue = 6,
    Pink = 7,
    Purple = 8,
    Brown = 9,
    White = 10,
    Black = 11
);

/// Mii character features (facial features, etc)
pub struct MiiFeatures {
    //
}

// From https://www.3dbrew.org/wiki/Mii#Mii_format
#[repr(C)] // Just in case
struct MiiDataRaw {
    version: u8,
    meta_flags: u8,
    selection_position: u8,
    source_device: u8,
    system_id: [u8; 0x8],
    mii_id: [u8; 0x4], // Big endian, apparently?
    creator_mac_address: [u8; 0x6],

    _padding: [u8; 0x2],

    mii_flags: [u8; 0x2],
    mii_name: [u8; 0x14],
    width_height: [u8; 0x2],
    sharing_face_shape_skin_color: u8,
    wrinkles_makeup: u8,
    hair_style: u8,
    hair_color_flip_hair: u8,
    eyes: [u8; 0x4],
    eyebrows: [u8; 0x4],
    nose: [u8; 0x2],
    mouth: [u8; 0x2],
    mouth_y_mustache: [u8; 0x2],
    beard_mustache: [u8; 0x2],
    glasses: [u8; 0x2],
    mole: [u8; 0x2],
    author_name: [u8; 0x14],
}

impl From<[u8; 0x5C]> for MiiDataRaw {
    fn from(value: [u8; 0x5C]) -> Self {
        // SAFETY: MiiDataRaw has no invalid variants
        // Validation is not performed for this type
        unsafe { std::mem::transmute(value) }
    }
}
