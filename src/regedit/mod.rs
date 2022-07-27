use windows::{
    core::PCWSTR,
    Win32::{
        Foundation::NO_ERROR,
        System::Registry::{
            RegCloseKey, RegCreateKeyExW, RegQueryValueExW, RegSetValueExW, HKEY,
            HKEY_CURRENT_USER, KEY_QUERY_VALUE, KEY_SET_VALUE, REG_DWORD, REG_OPTION_NON_VOLATILE,
        },
    },
};

pub trait Value<T> {
    fn set(&self, name: &str, value: T) -> Result<(), String>;
    fn get(&self, name: &str) -> Result<T, String>;
}
pub struct Regedit {
    hkey: HKEY,
}

impl Regedit {
    pub fn new(key: HKEY, subkey: &str) -> Regedit {
        let hkey = unsafe {
            let mut hkey = HKEY::default();
            let error = RegCreateKeyExW(
                key,
                subkey,
                0,
                PCWSTR::default(),
                REG_OPTION_NON_VOLATILE,
                KEY_QUERY_VALUE | KEY_SET_VALUE,
                std::ptr::null(),
                &mut hkey,
                std::ptr::null_mut(),
            );
            if error != NO_ERROR {
                panic!("RegCreateKeyExW error: {:?}", error);
            }
            hkey
        };
        Regedit { hkey }
    }
    pub fn user(subkey: &str) -> Regedit {
        Self::new(HKEY_CURRENT_USER, subkey)
    }
    pub fn set_value(&self, name: &str, value: *const u8, size: u32) -> Result<(), String> {
        unsafe {
            let error = RegSetValueExW(self.hkey, name, 0, REG_DWORD, value, size);
            if error == NO_ERROR {
                Ok(())
            } else {
                Err("RegSetValueExW".to_owned())
            }
        }
    }
    pub fn get_value(&self, name: &str, value: *mut u8, mut size: u32) -> Result<(), String> {
        unsafe {
            let error = RegQueryValueExW(
                self.hkey,
                name,
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                value,
                &mut size,
            );
            if error == NO_ERROR {
                Ok(())
            } else {
                Err("RegQueryValueExW".to_owned())
            }
        }
    }
}

impl Value<u32> for Regedit {
    fn set(&self, name: &str, value: u32) -> Result<(), String> {
        self.set_value(name, &value as *const u32 as _, 4)
    }
    fn get(&self, name: &str) -> Result<u32, String> {
        let mut value = 0u32;
        self.get_value(name, &mut value as *mut u32 as _, 4)
            .map(|_| value)
    }
}

impl Drop for Regedit {
    fn drop(&mut self) {
        unsafe {
            RegCloseKey(self.hkey);
        }
    }
}
