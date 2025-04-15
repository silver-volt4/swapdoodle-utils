use std::time::{Duration, SystemTime};

use crate::bits::PickBit;

pub struct MiiData {
    pub copying_allowed: bool,
    pub region_lock: MiiRegionLock,
    pub name_has_profanity: bool,
    pub name_character_set: MiiNameCharacterSet,
    pub position: MiiPosition,
    pub source_device: MiiSourceDevice,
    pub system_id: [u8; 8], // Could maybe be changed to a u128?
    pub mii_id: u32,
    pub mii_creation_date: SystemTime,
    pub is_special_mii: bool,
    pub creator_mac_address: [u8; 6],
    pub mii_gender: MiiGender,
    pub mii_birthday_month: chrono::Month,
    pub mii_birthday_day: u8,
    pub favorite_color: MiiFavoriteColor,
    pub is_favorite: bool,
    pub mii_name: String,
    pub sharing_disabled: bool,
    pub mii_features: MiiFeatures,
    pub creator_name: String,
}

pub enum MiiDeserializeError {
    UnknownVersion(u8),
    UnknownSourceDevice(u8),
    InvalidBirthdayMonth(u8),
    InvalidFavoriteColor(u8),
}

fn name_from_bytes(bytes: [u8; 20]) -> String {
    let name: Vec<u16> = bytes
        .chunks_exact(2)
        .take_while(|b| b[0] | b[1] != 0)
        .map(|b| u16::from_le_bytes([b[0], b[1]]))
        .collect();
    String::from_utf16_lossy(&name)
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
        let name_has_profanity = raw.meta_flags.pick_bit(1);
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
        let mii_epoch = SystemTime::UNIX_EPOCH + Duration::from_secs(1262304000); // Jan 1st 2010 00:00:00
        let mii_creation_date = mii_epoch + Duration::from_secs(mii_id.pick_bits(0..28) as u64);
        let is_special_mii = mii_id.pick_bit(31);
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
        let mii_name = name_from_bytes(raw.mii_name);
        let sharing_disabled = raw.sharing_face_shape_skin_color.pick_bit(0);

        let eyes = u32::from_le_bytes(raw.eyes);
        let eyebrows = u32::from_le_bytes(raw.eyebrows);
        let nose = u16::from_le_bytes(raw.nose);
        let mouth = u16::from_le_bytes(raw.mouth);
        let mouth_y_mustache = u16::from_le_bytes(raw.mouth_y_mustache);
        let beard_mustache = u16::from_le_bytes(raw.beard_mustache);
        let glasses = u16::from_le_bytes(raw.glasses);
        let mole = u16::from_le_bytes(raw.mole);
        let mii_features = MiiFeatures {
            width: raw.width_height[0],
            height: raw.width_height[1],

            face_shape: raw.sharing_face_shape_skin_color.pick_bits(1..5),
            skin_color: raw.sharing_face_shape_skin_color.pick_bits(5..8),

            wrinkles: raw.wrinkles_makeup.pick_bits(0..4),
            makeup: raw.wrinkles_makeup.pick_bits(4..8),

            hair_style: raw.hair_style,

            hair_color: raw.hair_color_flip_hair.pick_bits(0..3),
            flip_hair: raw.hair_color_flip_hair.pick_bit(3),

            eye_style: eyes.pick_bits(0..6) as u8,
            eye_color: eyes.pick_bits(6..9) as u8,
            eye_scale: eyes.pick_bits(9..13) as u8,
            eye_scale_y: eyes.pick_bits(13..16) as u8,
            eye_rotation: eyes.pick_bits(16..21) as u8,
            eye_spacing_x: eyes.pick_bits(21..25) as u8,
            eye_position_y: eyes.pick_bits(25..30) as u8,

            eyebrow_style: eyebrows.pick_bits(0..5) as u8,
            eyebrow_color: eyebrows.pick_bits(5..8) as u8,
            eyebrow_scale: eyebrows.pick_bits(8..12) as u8,
            eyebrow_scale_y: eyebrows.pick_bits(12..15) as u8,
            eyebrow_rotation: eyebrows.pick_bits(16..20) as u8,
            eyebrow_spacing_x: eyebrows.pick_bits(21..25) as u8,
            eyebrow_position_y: eyebrows.pick_bits(25..30) as u8,

            nose_style: nose.pick_bits(0..5) as u8,
            nose_scale: nose.pick_bits(5..9) as u8,
            nose_position_y: nose.pick_bits(9..14) as u8,

            mouth_style: mouth.pick_bits(0..6) as u8,
            mouth_color: mouth.pick_bits(6..9) as u8,
            mouth_scale: mouth.pick_bits(9..13) as u8,
            mouth_scale_y: mouth.pick_bits(13..16) as u8,

            mouth_position_y: mouth_y_mustache.pick_bits(0..5) as u8,
            mustache_style: mouth_y_mustache.pick_bits(5..8) as u8,

            beard_style: beard_mustache.pick_bits(0..3) as u8,
            beard_color: beard_mustache.pick_bits(3..6) as u8,
            mustache_scale: beard_mustache.pick_bits(6..10) as u8,
            mustache_position_y: beard_mustache.pick_bits(10..15) as u8,

            glasses_style: glasses.pick_bits(0..4) as u8,
            glasses_color: glasses.pick_bits(4..7) as u8,
            glasses_scale: glasses.pick_bits(7..11) as u8,
            glasses_position_y: glasses.pick_bits(11..16) as u8,

            mole_enabled: mole.pick_bit(0),
            mole_scale: mole.pick_bits(1..5) as u8,
            mole_position_x: mole.pick_bits(5..10) as u8,
            mole_position_y: mole.pick_bits(10..15) as u8,
        };

        let creator_name = name_from_bytes(raw.author_name);

        Ok(MiiData {
            copying_allowed,
            region_lock,
            name_has_profanity,
            name_character_set,
            position,
            source_device,
            system_id,
            mii_id,
            mii_creation_date,
            is_special_mii,
            creator_mac_address,
            mii_gender,
            mii_birthday_month,
            mii_birthday_day,
            favorite_color,
            is_favorite,
            mii_name,
            sharing_disabled,
            mii_features,
            creator_name,
        })
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
    pub width: u8,
    pub height: u8,

    pub face_shape: u8,
    pub skin_color: u8,

    pub wrinkles: u8,
    pub makeup: u8,

    pub hair_style: u8,

    pub hair_color: u8,
    pub flip_hair: bool,

    pub eye_style: u8,
    pub eye_color: u8,
    pub eye_scale: u8,
    pub eye_scale_y: u8,
    pub eye_rotation: u8,
    pub eye_spacing_x: u8,
    pub eye_position_y: u8,

    pub eyebrow_style: u8,
    pub eyebrow_color: u8,
    pub eyebrow_scale: u8,
    pub eyebrow_scale_y: u8,
    pub eyebrow_rotation: u8,
    pub eyebrow_spacing_x: u8,
    pub eyebrow_position_y: u8,

    pub nose_style: u8,
    pub nose_scale: u8,
    pub nose_position_y: u8,

    pub mouth_style: u8,
    pub mouth_color: u8,
    pub mouth_scale: u8,
    pub mouth_scale_y: u8,

    pub mouth_position_y: u8,
    pub mustache_style: u8,

    pub beard_style: u8,
    pub beard_color: u8,
    pub mustache_scale: u8,
    pub mustache_position_y: u8,

    pub glasses_style: u8,
    pub glasses_color: u8,
    pub glasses_scale: u8,
    pub glasses_position_y: u8,

    pub mole_enabled: bool,
    pub mole_scale: u8,
    pub mole_position_x: u8,
    pub mole_position_y: u8,
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
