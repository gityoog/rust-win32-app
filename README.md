# rust-win32-app

## start

```
$ git clone https://github.com/gityoog/rust-win32-app.git
$ cd rust-win32-app
$ cargo run
```

## preview

![image](./doc/ui.png)

## develop UI

```
$ cd web
$ npm install
$ npm run dev
```

```rust
// main.rs
-  let dev = cfg!(debug_assertions) && false;
+  let dev = cfg!(debug_assertions);
```

## build

```
$ cd web
$ npm run build
$ cargo build --release
```
