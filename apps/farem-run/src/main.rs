use std::io::Write;

use domains::generate_random_file;
use duct::cmd;
use rocket::{launch, post, routes};

#[post("/execute", data = "<wasm>")]
async fn execute(wasm: Vec<u8>) -> String {
    let (mut file, file_path) = generate_random_file(Some("wasm")).unwrap();
    file.write_all(wasm.as_slice()).unwrap();
    cmd!("wasmtime", file_path).read().unwrap()
}

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", routes![execute])
}
