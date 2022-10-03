use duct::cmd;
use rocket::{
    fs::NamedFile, get, launch, post, response::status::BadRequest, routes, serde::json::Json,
};
use serde::Deserialize;
use std::fs;
use utilities::generate_random_file;

#[derive(Debug, PartialEq, Eq, Deserialize)]
struct FaremInput {
    code: String,
}

#[get("/example")]
fn example() -> String {
    include_str!("../../../libs/examples/src/rs/example.rs")
        .trim()
        .to_string()
}

#[post("/farem", data = "<code_input>")]
async fn farem(code_input: Json<FaremInput>) -> Result<NamedFile, BadRequest<String>> {
    let (_, input_file_path) = generate_random_file(Some("rs")).unwrap();
    fs::write(&input_file_path, &code_input.code).unwrap();
    let (_, output_file_path) = generate_random_file(Some("wasm")).unwrap();
    let stderr = cmd!(
        "rustc",
        &input_file_path,
        "--target",
        "wasm32-wasi",
        "-o",
        &output_file_path
    )
    .unchecked()
    .stderr_capture()
    .run()
    .unwrap();
    if stderr.status.success() {
        Ok(NamedFile::open(&output_file_path).await.unwrap())
    } else {
        Err(BadRequest(String::from_utf8(stderr.stderr).ok()))
    }
}

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", routes![example, farem])
}
