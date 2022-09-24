#![feature(proc_macro_hygiene, decl_macro)]

use duct::cmd;
use rocket::{fs::NamedFile, launch, serde::json::Json};
use serde::Deserialize;
use std::io::Write;
use tempfile::Builder;

#[macro_use]
extern crate rocket;

#[derive(Debug, PartialEq, Eq, Deserialize)]
struct FaremInput {
    rust: String,
}

#[get("/example")]
fn example() -> String {
    let code = r#"
use std::collections::HashMap;

fn main() {
  println!("hello world, and welcome to CodeFarem!");
}
"#
    .trim()
    .to_string();
    code
}

#[post("/farem", data = "<code_input>")]
async fn farem(code_input: Json<FaremInput>) -> Option<NamedFile> {
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
    let resp = NamedFile::open(&output_file).await.ok();
    input_file.close().unwrap();
    output_file.close().unwrap();
    resp
}

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", routes![example, farem])
}
