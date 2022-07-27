use crate::com::IAxWinHostWindow;
use crate::regedit::{Regedit, Value};
use crate::variant::Variant;

use self::event::BrowserEvent;
use self::js::BrowserJS;

use std::cell::RefCell;
use windows::Win32::Foundation::HWND;
use windows::Win32::System::Ole::{
    SafeArrayCreateVector, SafeArrayDestroy, SafeArrayPutElement, VT_VARIANT,
};
use windows::Win32::UI::Shell::DWebBrowserEvents2;
use windows::{
    core::{IUnknown, Interface},
    Win32::UI::Shell::IWebBrowser2,
    Win32::{System::Com::*, Web::MsHtml::IHTMLDocument2},
};
mod event;
mod js;

pub struct Browser<'a> {
    instance: RefCell<Option<IWebBrowser2>>,
    doc: RefCell<Option<IHTMLDocument2>>,
    unset_html: RefCell<Option<String>>,
    navigated: RefCell<Option<Box<dyn Fn() + 'a>>>,
}

impl<'a> Browser<'a> {
    pub fn new() -> Browser<'a> {
        Browser {
            doc: RefCell::new(None),
            instance: RefCell::new(None),
            unset_html: RefCell::new(None),
            navigated: RefCell::new(None),
        }
    }
    pub fn init(&self, hwnd: HWND, host: IUnknown) {
        let instance = unsafe {
            let wnd: IAxWinHostWindow = host.cast().unwrap();
            let mut p_web: Option<IWebBrowser2> = None;
            wnd.QueryControl(IWebBrowser2::IID, &mut p_web as *mut _ as _)
                .unwrap();
            let instance = p_web.unwrap();
            let event: IDispatch = BrowserEvent::new(hwnd).into();
            let js: IDispatch = BrowserJS::new(hwnd).into();
            wnd.SetExternalDispatch(core::mem::transmute(js)).unwrap();
            instance.SetSilent(1).unwrap();
            instance
                .cast::<IConnectionPointContainer>()
                .unwrap()
                .FindConnectionPoint(&DWebBrowserEvents2::IID)
                .unwrap()
                .Advise(event)
                .unwrap();
            instance
        };
        self.instance.replace(Some(instance));
        self.navigate("about:blank", None);
    }
    fn get(&self) -> Option<IWebBrowser2> {
        self.instance.borrow().clone()
    }
    pub fn navigate(&self, url: &str, callback: Option<Box<dyn Fn() + 'a>>) {
        self.navigated.replace(callback);
        unsafe {
            if let Some(instance) = self.get() {
                let null = std::ptr::null();
                instance.Navigate(url, null, null, null, null).unwrap();
            } else {
                println!("Browser::navigate() instance is None");
            }
        }
    }
    pub fn update_doc(&self) {
        if let Some(instance) = self.get() {
            self.doc
                .replace(unsafe { instance.Document().unwrap().cast::<IHTMLDocument2>().ok() });
            let html = self.unset_html.borrow().clone();
            if let Some(html) = html {
                self.html(&html);
            }
        }
        if let Some(navigated) = self.navigated.take() {
            navigated();
        }
    }
    pub fn html(&self, html: &str) {
        let doc = self.doc.borrow().clone();
        if let Some(doc) = doc {
            self.unset_html.replace(None);
            unsafe {
                let arr = SafeArrayCreateVector(VT_VARIANT.0 as u16, 0, 1);
                SafeArrayPutElement(arr, &0i32, Variant::from(html).ptr() as *const _ as _)
                    .unwrap();
                doc.write(arr).unwrap();
                SafeArrayDestroy(arr).unwrap();
            }
        } else {
            let old = self.unset_html.borrow_mut().take();
            if let Some(old) = old {
                self.unset_html.replace(Some(old + html));
            } else {
                self.unset_html.replace(Some(html.to_string()));
            }
        }
    }
}

impl<'a> Browser<'a> {
    pub fn check_version() {
        let path = std::env::current_exe().unwrap();
        let file_name = path.file_name().unwrap();
        let reg = Regedit::user("Software\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION");
        let result = reg.get(file_name.to_str().unwrap());
        if let Ok(version) = result {
            println!("Browser::check_version() {}", version);
        } else {
            let result = reg.set(file_name.to_str().unwrap(), 11001);
            if let Err(err) = result {
                println!("Browser::check_version() {}", err);
            }
        }
    }
}
