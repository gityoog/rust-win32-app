#[macro_export]
macro_rules! callback {
    ($($args:tt)*) => {
        Some(Box::new(|| {
            $(
                $args
            )*
        }))
    };
}
