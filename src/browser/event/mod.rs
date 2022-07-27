use windows::core::*;
use windows::Win32::Foundation::{HWND, LPARAM, WPARAM};
use windows::Win32::System::Com::*;
use windows::Win32::Web::MsHtml::{DISPID_BEFORENAVIGATE2, DISPID_DOCUMENTCOMPLETE};
use windows::Win32::UI::WindowsAndMessaging::SendMessageW;

use crate::dialog::WM_BROWSER_DOCUMENTCOMPLETE;

#[implement(IDispatch)]
pub struct BrowserEvent {
    hwnd: HWND,
}
impl BrowserEvent {
    pub fn new(hwnd: HWND) -> BrowserEvent {
        BrowserEvent { hwnd }
    }
}

impl IDispatch_Impl for BrowserEvent {
    fn GetTypeInfoCount(&self) -> windows::core::Result<u32> {
        Ok(0)
    }

    fn GetTypeInfo(&self, _itinfo: u32, _lcid: u32) -> windows::core::Result<ITypeInfo> {
        todo!("BrowserEvent::GetTypeInfo()")
    }

    fn GetIDsOfNames(
        &self,
        _riid: *const windows::core::GUID,
        _rgsznames: *const windows::core::PWSTR,
        _cnames: u32,
        _lcid: u32,
        _rgdispid: *mut i32,
    ) -> windows::core::Result<()> {
        println!("BrowserEvent::GetIDsOfNames()");
        Ok(())
    }

    fn Invoke(
        &self,
        dispidmember: i32,
        _riid: *const windows::core::GUID,
        _lcid: u32,
        _wflags: u16,
        pdispparams: *const DISPPARAMS,
        _pvarresult: *mut VARIANT,
        _pexcepinfo: *mut EXCEPINFO,
        _puargerr: *mut u32,
    ) -> windows::core::Result<()> {
        match dispidmember as u32 {
            DISPID_BEFORENAVIGATE2 => unsafe {
                // (*pdispparams).rgvarg.write(val);
                let url = (*(*(*pdispparams).rgvarg.add(5))
                    .Anonymous
                    .Anonymous
                    .Anonymous
                    .pvarVal)
                    .Anonymous
                    .Anonymous
                    .Anonymous
                    .bstrVal
                    .to_string();
                if !url.starts_with("javascript:")
                    && !url.starts_with("http://127.0.0.1")
                    && !url.starts_with("http://192.168")
                    && !url.eq("about:blank")
                {
                    (*(*(*pdispparams).rgvarg).Anonymous.Anonymous)
                        .Anonymous
                        .pboolVal
                        .write(-1);
                    println!("{} [block]", url);
                }
            },
            DISPID_DOCUMENTCOMPLETE => unsafe {
                SendMessageW(self.hwnd, WM_BROWSER_DOCUMENTCOMPLETE, WPARAM(0), LPARAM(0));
            },
            _ => {}
        };
        Ok(())
    }
}
