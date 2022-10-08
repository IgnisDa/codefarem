use std::io::Write;

use duct::cmd;
use rocket::{launch, post, response::status::BadRequest, routes};
use utilities::generate_random_file;

#[post("/execute", data = "<wasm>")]
async fn execute(wasm: Vec<u8>) -> Result<String, BadRequest<String>> {
    let (mut file, file_path) = generate_random_file(Some("wasm")).unwrap();
    file.write_all(wasm.as_slice()).unwrap();
    let command_output = cmd!("wasmtime", file_path)
        .unchecked()
        .stdout_capture()
        .stderr_capture()
        .run()
        .unwrap();
    if command_output.status.success() {
        Ok(String::from_utf8(command_output.stdout).unwrap())
    } else {
        Err(BadRequest(String::from_utf8(command_output.stderr).ok()))
    }
}

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", routes![execute])
}
