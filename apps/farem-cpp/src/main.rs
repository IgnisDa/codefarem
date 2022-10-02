use duct::cmd;
use rocket::{fs::NamedFile, get, launch, post, routes, serde::json::Json};
use serde::Deserialize;
use std::fs;
use utilities::generate_random_file;

#[derive(Debug, PartialEq, Eq, Deserialize)]
struct FaremInput {
    code: String,
}

#[get("/example")]
fn example() -> String {
    include_str!("../../../libs/examples/src/cpp/example.cpp")
        .trim()
        .to_string()
}

#[post("/farem", data = "<code_input>")]
async fn farem(code_input: Json<FaremInput>) -> Option<NamedFile> {
    let (_, input_file_path) = generate_random_file(Some("cpp")).unwrap();
    fs::write(&input_file_path, &code_input.code).unwrap();
    let (_, output_file_path) = generate_random_file(Some("wasm")).unwrap();
    cmd!(
        "emcc",
        &input_file_path,
        "-s",
        "STANDALONE_WASM",
        "-o",
        &output_file_path
    )
    .run()
    .unwrap();
    NamedFile::open(&output_file_path).await.ok()
}

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", routes![example, farem])
}
