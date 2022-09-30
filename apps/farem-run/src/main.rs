use std::io::Write;

use duct::cmd;
use rocket::{launch, post, routes};
use utilities::generate_random_file;

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
