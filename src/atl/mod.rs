use std::cell::RefCell;

use windows::{
    core::IUnknown,
    Win32::{
        Foundation::{HINSTANCE, HWND},
        System::LibraryLoader::{FreeLibrary, GetProcAddress, LoadLibraryW},
    },
};

type TypeAtlAxGetControl = extern "system" fn(hwnd: HWND, *const IUnknown) -> isize;
type TypeAtlAxGetHost = extern "system" fn(hwnd: HWND, *const IUnknown) -> isize;

pub struct Atl {
    instance: HINSTANCE,
    fn_get_control: RefCell<Option<TypeAtlAxGetControl>>,
    fn_get_host: RefCell<Option<TypeAtlAxGetHost>>,
}
impl Atl {
    pub fn new() -> Atl {
        unsafe {
            let instance = LoadLibraryW("atl.dll").expect("Failed to load atl.dll");
            GetProcAddress(instance, "AtlAxWinInit").expect("Failed to get AtlAxWinInit")();
            Atl {
                instance,
                fn_get_control: RefCell::new(None),
                fn_get_host: RefCell::new(None),
            }
        }
    }
    #[allow(dead_code)]
    pub fn ax_get_control(&self, hwnd: HWND) -> Option<IUnknown> {
        if self.fn_get_control.borrow().is_none() {
            self.fn_get_control.replace(Some(unsafe {
                std::mem::transmute::<_, TypeAtlAxGetControl>(
                    GetProcAddress(self.instance, "AtlAxGetControl")
                        .expect("Failed to get AtlAxGetControl"),
                )
            }));
        }
        let mut control: Option<IUnknown> = None;
        self.fn_get_control.borrow().unwrap()(hwnd, &mut control as *mut _ as _);
        control
    }
    pub fn ax_get_host(&self, hwnd: HWND) -> Option<IUnknown> {
        if self.fn_get_host.borrow().is_none() {
            self.fn_get_host.replace(Some(unsafe {
                std::mem::transmute::<_, TypeAtlAxGetHost>(
                    GetProcAddress(self.instance, "AtlAxGetHost")
                        .expect("Failed to get AtlAxGetHost"),
                )
            }));
        }
        let mut host: Option<IUnknown> = None;
        self.fn_get_host.borrow().unwrap()(hwnd, &mut host as *mut _ as _);
        host
    }
}

impl Drop for Atl {
    fn drop(&mut self) {
        unsafe {
            FreeLibrary(self.instance);
        }
    }
}
