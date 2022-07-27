use windows::Win32::{
    Foundation::*,
    Graphics::Gdi::{CreateRoundRectRgn, SetWindowRgn},
    UI::WindowsAndMessaging::*,
};

use crate::{
    bus::Bus,
    resource::{Resource, IDC_EXPLORER1, IDD_DLG, MAKEINTRESOURCE},
};

pub struct Dialog {
    pub hwnd: HWND,
}

impl Dialog {
    pub fn new(res: &Resource) -> Dialog {
        unsafe {
            let hwnd =
                CreateDialogParamW(res.handle, MAKEINTRESOURCE(IDD_DLG), None, Some(proc), None);
            SetWindowTextW(hwnd, env!("CARGO_PKG_NAME"));
            // let icon = LoadIconW(handle, MAKEINTRESOURCE(ICON)).expect("Failed to load icon");
            // SendMessageW(hwnd, WM_SETICON, WPARAM(ICON_BIG as usize), LPARAM(icon.0));
            Dialog { hwnd }
        }
    }
    pub fn loop_msg(&self) {
        unsafe {
            let mut msg = MSG::default();
            while GetMessageW(&mut msg, None, 0, 0).as_bool() {
                TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        }
    }
    pub fn explorer(&self) -> HWND {
        unsafe { GetDlgItem(self.hwnd, IDC_EXPLORER1 as i32) }
    }
    pub fn show(&self) {
        unsafe {
            ShowWindow(self.hwnd, SW_SHOW);
            // AnimateWindow(self.hwnd, 500, AW_BLEND);
        }
    }
    pub fn close(&self) {
        unsafe {
            SendMessageW(self.hwnd, WM_CLOSE, WPARAM(0), LPARAM(0));
        }
    }
    pub fn maximize(&self) {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_SYSCOMMAND,
                WPARAM(SC_MAXIMIZE as usize),
                LPARAM(0),
            );
        }
    }
    pub fn minimize(&self) {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_SYSCOMMAND,
                WPARAM(SC_MINIMIZE as usize),
                LPARAM(0),
            );
        }
    }
    pub fn restore(&self) {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_SYSCOMMAND,
                WPARAM(SC_RESTORE as usize),
                LPARAM(0),
            );
        }
    }
    pub fn is_zoomed(&self) -> bool {
        unsafe { IsZoomed(self.hwnd).as_bool() }
    }
    pub fn start_move(&self) {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_NCLBUTTONDOWN,
                WPARAM(HTCAPTION as usize),
                LPARAM(0),
            );
        }
    }
    pub fn start_resize(&self) {
        unsafe {
            SendMessageW(
                self.hwnd,
                WM_SYSCOMMAND,
                WPARAM((SC_SIZE | WMSZ_BOTTOMRIGHT) as usize),
                LPARAM(0),
            );
        }
    }
}

fn LOWORD(lparam: LPARAM) -> u32 {
    (lparam.0 & 0xFFFF) as u32
}
fn HIWORD(lparam: LPARAM) -> u32 {
    (lparam.0 >> 16) as u32
}
pub const WM_BROWSER_DOCUMENTCOMPLETE: u32 = WM_USER + 1;
pub const WM_BROWSER_CALL: u32 = WM_USER + 2;

unsafe extern "system" fn proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> isize {
    match msg {
        WM_INITDIALOG => {
            // 无边框
            let old = WINDOW_STYLE(GetWindowLongW(hwnd, GWL_STYLE) as u32);
            SetWindowLongW(
                hwnd,
                GWL_STYLE,
                (old & (WS_OVERLAPPED
                    | WS_VISIBLE
                    | WS_SYSMENU
                    | WS_MINIMIZEBOX
                    | WS_MAXIMIZEBOX
                    | WS_CLIPCHILDREN
                    | WS_CLIPSIBLINGS))
                    .0 as _,
            );
            // 阴影
            SystemParametersInfoW(
                SPI_SETDROPSHADOW,
                0,
                &true as *const _ as _,
                SYSTEM_PARAMETERS_INFO_UPDATE_FLAGS(0),
            );
            let dwStyle = GetClassLongW(hwnd, GCL_STYLE) as i32;
            SetClassLongW(hwnd, GCL_STYLE, dwStyle | (CS_DROPSHADOW.0 as i32));

            // 窗口居中
            let width = GetSystemMetrics(SM_CXSCREEN);
            let height = GetSystemMetrics(SM_CYSCREEN);
            let mut rect = RECT::default();
            GetWindowRect(hwnd, &mut rect as _);
            SetWindowPos(
                hwnd,
                HWND_TOP,
                (width - rect.right) / 2,
                (height - rect.bottom) / 2,
                rect.right,
                rect.bottom,
                SWP_NOOWNERZORDER,
            );
            0
        }
        WM_SIZE => {
            let width = LOWORD(lparam) as i32;
            let height = HIWORD(lparam) as i32;
            //浏览框自适应铺满窗口
            MoveWindow(GetDlgItem(hwnd, 1003), 0, 0, width, height, false);

            //圆角
            let hrgn = CreateRoundRectRgn(0, 0, width, height, 2, 2);
            SetWindowRgn(hwnd, hrgn, true);
            0
        }
        WM_BROWSER_DOCUMENTCOMPLETE => {
            Bus::from(hwnd).doc_complete();
            0
        }
        WM_BROWSER_CALL => {
            Bus::from(hwnd).js_call(wparam.0);
            0
        }
        WM_CLOSE => {
            PostQuitMessage(0);
            0
        }
        WM_DESTROY => {
            PostQuitMessage(0);
            0
        }
        _ => 0,
    }
}
