#![feature(proc_macro_hygiene, decl_macro)]

use duct::cmd;
use rocket::response::NamedFile;
use rocket_contrib::json::Json;
use serde::Deserialize;
use std::io::Write;
use tempfile::Builder;

#[macro_use]
extern crate rocket;

#[derive(Debug, PartialEq, Eq, Deserialize)]
struct FaremInput {
    rust: String,
}

#[post("/farem", data = "<code_input>")]
fn farem(code_input: Json<FaremInput>) -> Option<NamedFile> {
    let mut builder = Builder::new();
    builder.prefix("farem").suffix(".rs").rand_bytes(16);
    let mut input_file = builder.tempfile().unwrap();
    let output_file = builder.tempfile().unwrap();
    write!(input_file, "{}", code_input.rust).unwrap();
    cmd!(
        "rustc",
        input_file.path(),
        "--target",
        "wasm32-wasi",
        "-o",
        output_file.path()
    )
    .run()
    .unwrap();
    NamedFile::open(output_file).ok()
}

fn main() {
    rocket::ignite().mount("/", routes![farem]).launch();
}
