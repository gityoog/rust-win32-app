use windows::core::*;
use windows::Win32::System::Com::IDispatch;

#[interface("b6ea2050-048a-11d1-82b9-00c04fb9942e")]
pub unsafe trait IAxWinHostWindow: IUnknown {
    pub unsafe fn CreateControl(&self);
    pub unsafe fn CreateControlEx(&self);
    pub unsafe fn AttachControl(&self);
    pub unsafe fn QueryControl(&self, iid: GUID, ppv: *mut *const IUnknown) -> HRESULT;
    pub unsafe fn SetExternalDispatch(&self, pdisp: *const IDispatch) -> HRESULT;
    pub unsafe fn SetExternalUIHandler(&self);
}
