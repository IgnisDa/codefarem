use duct::cmd;
use languages::{generate_input_and_output_files, run_command_and_capture_output};
use macros::proto_server;
use proc_macros::embed_image_as_base64;
use utilities::get_command_output;

const LOGO: &str = embed_image_as_base64!("logo/rs.png");

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/rs/example.rs").trim()
}

fn toolchain_version() -> String {
    get_command_output("rustc", &["--version"]).unwrap()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("rs", code);
    let command = cmd!(
        "rustc",
        &input_file_path,
        "--target",
        "wasm32-wasi",
        "-o",
        &output_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(example, compile, toolchain_version, LOGO);
