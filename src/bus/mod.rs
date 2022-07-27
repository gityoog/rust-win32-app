use std::cell::RefCell;

use std::collections::HashMap;
use windows::Win32::Foundation::HWND;
use windows::Win32::System::Com::{DISPPARAMS, VARIANT};
use windows::Win32::UI::WindowsAndMessaging::*;

use crate::browser::Browser;
use crate::dialog::Dialog;
use crate::variant::Variant;

pub struct Bus<'a> {
    doc_complete_callback: RefCell<Option<Box<dyn Fn() + 'a>>>,
    js_callback: RefCell<HashMap<String, Box<dyn Fn(*const DISPPARAMS) -> Option<VARIANT> + 'a>>>,
}

impl<'a> Bus<'a> {
    pub unsafe fn from(hwnd: HWND) -> &'a Bus<'a> {
        let ptr = GetWindowLongPtrW(hwnd, GWL_USERDATA);
        (ptr as *mut Bus).as_ref().unwrap()
    }
    pub fn bind(&self, hwnd: HWND) {
        unsafe {
            SetWindowLongPtrW(hwnd, GWL_USERDATA, self.ptr());
        }
    }
    pub fn new() -> Bus<'a> {
        Bus {
            doc_complete_callback: RefCell::new(None),
            js_callback: RefCell::new(HashMap::new()),
        }
    }
    pub fn on_doc_complete(&self, callback: Box<dyn Fn() + 'a>) {
        self.doc_complete_callback.replace(Some(callback));
    }
    pub fn doc_complete(&self) {
        if let Some(f) = self.doc_complete_callback.borrow().as_ref() {
            f();
        }
    }
    pub fn on_js_call(
        &self,
        map: HashMap<String, Box<dyn Fn(*const DISPPARAMS) -> Option<VARIANT> + 'a>>,
    ) {
        self.js_callback.replace(map);
    }
    pub fn js_call(&self, ptr: usize) {
        let params = JSCallParams::from(ptr);
        let map = self.js_callback.borrow();
        if let Some(f) = map.get(&params.method) {
            let result = f(params.args);
            if !params.result.is_null() && result.is_some() {
                unsafe {
                    params.result.write(result.unwrap());
                }
            }
        } else {
            println!("js_call method:`{}` not found", params.method);
        }
    }
    pub fn ptr(&self) -> isize {
        self as *const _ as isize
    }
}

macro_rules! map {
    ($($key: literal : $value: expr),* $(,)*) => {{
        let mut map = HashMap::<String, Box<dyn Fn(*const DISPPARAMS) -> Option<VARIANT> + 'a>>::new();
        $(map.insert($key.to_string(), Box::new($value));)*
        map
    }};
}

impl<'a> Bus<'a> {
    pub fn init(&self, dialog: &'a Dialog, browser: &'a Browser) {
        self.bind(dialog.hwnd);
        self.on_doc_complete(Box::new(|| {
            browser.update_doc();
        }));
        self.on_js_call(map! {
            "close": |_| {dialog.close(); None},
            "maximize": |_| {dialog.maximize(); None},
            "minimize": |_| {dialog.minimize(); None},
            "restore": |_| {dialog.restore(); None},
            "show": |_| {dialog.show(); None},
            "isZoomed": |_| Some(Variant::from(dialog.is_zoomed()).take()),
            "move": |_| {dialog.start_move(); None},
            "resize": |_| {dialog.start_resize(); None},
            "ready": |_| {dialog.show(); None},
        });
    }
}

#[derive(Debug)]
pub struct JSCallParams {
    pub method: String,
    pub args: *const DISPPARAMS,
    pub result: *mut VARIANT,
}

impl JSCallParams {
    pub fn new(method: &str, args: *const DISPPARAMS, result: *mut VARIANT) -> JSCallParams {
        JSCallParams {
            method: method.to_string(),
            args,
            result,
        }
    }

    pub fn into(self) -> usize {
        Box::into_raw(Box::new(self)) as usize
    }

    pub fn from(ptr: usize) -> JSCallParams {
        unsafe { *Box::from_raw(ptr as *mut JSCallParams) }
    }
}
