use std::cell::RefCell;

use windows::core::*;
use windows::Win32::Foundation::{HWND, LPARAM, WPARAM};
use windows::Win32::System::Com::IDispatch;
use windows::Win32::System::Com::*;
use windows::Win32::UI::WindowsAndMessaging::SendMessageW;

use crate::bus::JSCallParams;
use crate::dialog::WM_BROWSER_CALL;

#[implement(IDispatch)]
pub struct BrowserJS {
    hwnd: HWND,
    method: RefCell<String>,
}
impl BrowserJS {
    pub fn new(hwnd: HWND) -> BrowserJS {
        BrowserJS {
            hwnd,
            method: RefCell::new("".to_string()),
        }
    }
}
const DISPID_BROWSER_CALL: i32 = 1;

impl IDispatch_Impl for BrowserJS {
    fn GetTypeInfoCount(&self) -> windows::core::Result<u32> {
        println!("BrowserJS::GetTypeInfoCount()");
        Ok(0)
    }

    fn GetTypeInfo(&self, _itinfo: u32, _lcid: u32) -> windows::core::Result<ITypeInfo> {
        println!("BrowserJS::GetTypeInfo()");
        todo!()
    }

    fn GetIDsOfNames(
        &self,
        _riid: *const windows::core::GUID,
        rgsznames: *const windows::core::PWSTR,
        _cnames: u32,
        _lcid: u32,
        rgdispid: *mut i32,
    ) -> windows::core::Result<()> {
        unsafe {
            rgdispid.write(DISPID_BROWSER_CALL);
            self.method.replace(pwstr_to_string(*rgsznames));
        }
        Ok(())
    }

    fn Invoke(
        &self,
        _dispidmember: i32,
        _riid: *const windows::core::GUID,
        _lcid: u32,
        _wflags: u16,
        pdispparams: *const DISPPARAMS,
        pvarresult: *mut VARIANT,
        _pexcepinfo: *mut EXCEPINFO,
        _puargerr: *mut u32,
    ) -> windows::core::Result<()> {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_BROWSER_CALL,
                WPARAM(JSCallParams::new(&self.method.take(), pdispparams, pvarresult).into()),
                LPARAM(0),
            );
        }
        Ok(())
    }
}

fn pwstr_to_string(pwstr: windows::core::PWSTR) -> String {
    unsafe {
        let mut end = pwstr.0;
        while *end != 0 {
            end = end.add(1);
        }
        String::from_utf16_lossy(std::slice::from_raw_parts(
            pwstr.0,
            end.offset_from(pwstr.0) as usize,
        ))
    }
}
