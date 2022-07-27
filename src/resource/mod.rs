use windows::{
    core::PCWSTR,
    Win32::{
        Foundation::HINSTANCE,
        Media::KernelStreaming::RT_RCDATA,
        System::LibraryLoader::{
            FindResourceW, FreeResource, GetModuleHandleW, LoadResource, LockResource,
            SizeofResource,
        },
    },
};

pub const IDD_DLG: u16 = 1000;
pub const IDC_EXPLORER1: u16 = 1003;
pub const _ICON: u16 = 100;
pub const WEBZIP: u16 = 101;

pub struct Resource {
    pub handle: HINSTANCE,
}

pub fn MAKEINTRESOURCE(id: u16) -> PCWSTR {
    PCWSTR(id as *const u16)
}

impl Resource {
    pub fn new() -> Resource {
        Resource {
            handle: unsafe { GetModuleHandleW(None).expect("Failed to get module handle") },
        }
    }
    pub fn webzip(&self) -> &'static [u8] {
        unsafe {
            let hresinfo = FindResourceW(self.handle, MAKEINTRESOURCE(WEBZIP), RT_RCDATA);
            let hresdata = LoadResource(self.handle, hresinfo);
            let buffer = std::slice::from_raw_parts(
                LockResource(hresdata) as *mut u8,
                (SizeofResource(self.handle, hresinfo)).try_into().unwrap(),
            );
            FreeResource(hresdata);
            buffer
        }
    }
}
