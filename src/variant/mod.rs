use std::mem::ManuallyDrop;
use windows::Win32::System::Ole::{VT_BOOL, VT_I4};
use windows::Win32::{
    Foundation::BSTR,
    System::{
        Com::*,
        Ole::{VARENUM, VT_BSTR},
    },
};

pub struct Variant(VARIANT);
impl Variant {
    pub fn new(num: VARENUM, contents: VARIANT_0_0_0) -> Variant {
        Variant {
            0: VARIANT {
                Anonymous: VARIANT_0 {
                    Anonymous: ManuallyDrop::new(VARIANT_0_0 {
                        vt: num.0 as u16,
                        wReserved1: 0,
                        wReserved2: 0,
                        wReserved3: 0,
                        Anonymous: contents,
                    }),
                },
            },
        }
    }
    pub fn ptr(&self) -> &VARIANT {
        &self.0
    }
    pub fn take(mut self) -> VARIANT {
        std::mem::take(&mut self.0)
    }
}
impl From<String> for Variant {
    fn from(value: String) -> Variant {
        Variant::new(
            VT_BSTR,
            VARIANT_0_0_0 {
                bstrVal: ManuallyDrop::new(BSTR::from(value)),
            },
        )
    }
}
impl From<&str> for Variant {
    fn from(value: &str) -> Variant {
        Variant::from(value.to_string())
    }
}
impl From<i32> for Variant {
    fn from(value: i32) -> Variant {
        Variant::new(VT_I4, VARIANT_0_0_0 { lVal: value })
    }
}
impl From<bool> for Variant {
    fn from(value: bool) -> Variant {
        let value = if value { -1 } else { 0 };
        Variant::new(
            VT_BOOL,
            VARIANT_0_0_0 {
                pboolVal: value as *mut _,
            },
        )
    }
}

impl Drop for Variant {
    fn drop(&mut self) {
        match VARENUM(unsafe { self.0.Anonymous.Anonymous.vt as i32 }) {
            VT_BSTR => unsafe { drop(&mut &self.0.Anonymous.Anonymous.Anonymous.bstrVal) },
            _ => {}
        }
        unsafe { drop(&mut self.0.Anonymous.Anonymous) }
    }
}
