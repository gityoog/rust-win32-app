use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server};
use portpicker::pick_unused_port;
use std::convert::Infallible;
use std::io::{Cursor, Read};
use std::net::SocketAddr;
use zip::result::ZipError;
use zip::ZipArchive;
pub struct UiServer {
    port: u16,
    rt: tokio::runtime::Runtime,
}
impl UiServer {
    pub fn new() -> Self {
        let port = pick_unused_port().expect("failed to find unused port");
        Self {
            port,
            rt: tokio::runtime::Runtime::new().unwrap(),
        }
    }

    pub fn run(&self, file: &'static [u8]) -> String {
        let addr = SocketAddr::from(([127, 0, 0, 1], self.port));
        let url = "http://".to_owned() + &addr.to_string();
        self.rt.spawn(async move {
            let zip = ZipArchive::new(Cursor::new(file)).unwrap();
            let make_svc = make_service_fn(|_| {
                let mut zip = zip.clone();
                async move {
                    Ok::<_, Infallible>(service_fn(move |req: Request<Body>| {
                        let mut name = req.uri().path().to_string();
                        if name.ends_with('/') {
                            name = format!("{}index.html", name);
                        }
                        let name = name.strip_prefix('/').unwrap_or(&name);
                        // println!("{}", name);
                        let res = match zip.by_name(name) {
                            Ok(mut file) => {
                                let mut body = Vec::with_capacity(file.size() as usize);
                                file.read_to_end(&mut body).unwrap();
                                let body = Body::from(body);
                                Ok::<_, Infallible>(Response::new(body))
                            }
                            Err(err) => {
                                let builder = Response::builder()
                                    .status(404)
                                    .header("Content-Type", "text/plain");
                                let err = match err {
                                    ZipError::FileNotFound => "File not found",
                                    ZipError::Io(_) => "I/O error",
                                    ZipError::InvalidArchive(err) => err,
                                    ZipError::UnsupportedArchive(err) => err,
                                };
                                Ok::<_, Infallible>(builder.body(Body::from(err)).unwrap())
                            }
                        };
                        async move { res }
                    }))
                }
            });
            let server = Server::bind(&addr).serve(make_svc);
            println!("Listening on http://{}", addr);
            if let Err(e) = server.await {
                eprintln!("server error: {}", e);
            }
        });
        url
    }
}
