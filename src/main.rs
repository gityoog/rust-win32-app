#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(non_snake_case)]

mod atl;
mod browser;
mod bus;
mod com;
mod dialog;
mod regedit;
mod resource;
mod server;
mod util;
mod variant;

use atl::Atl;
use browser::Browser;
use bus::Bus;
use dialog::Dialog;
use resource::Resource;
use server::UiServer;

fn main() {
    Browser::check_version();
    let res = Resource::new();
    let atl = Atl::new();
    let dialog = Dialog::new(&res);
    let browser = Browser::new();
    let bus = Bus::new();
    let server = UiServer::new();
    bus.init(&dialog, &browser);
    browser.init(dialog.hwnd, atl.ax_get_host(dialog.explorer()).unwrap());
    let url = match cfg!(debug_assertions) {
        // run `npm run dev` on `/web` for debug
        true => "http://127.0.0.1:10010".to_string(),
        false => server.run(res.webzip()),
    };
    browser.navigate(&url, callback! {dialog.show();});
    dialog.loop_msg();
}
