use duct::cmd;
use languages::{generate_input_and_output_files, run_command_and_capture_output};
use macros::proto_server;
use proc_macros::embed_image_as_base64;
use utilities::get_command_output;

const LOGO: &str = embed_image_as_base64!("logo/go.png");
const EXAMPLE: &str = include_str!("../../../../libs/examples/src/go/example.go");

fn toolchain_version() -> String {
    get_command_output("tinygo", &["version"]).unwrap()
}

fn farem(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("go", code);
    let command = cmd!(
        "tinygo",
        "build",
        "-wasm-abi=generic",
        "-target=wasi",
        "-o",
        &output_file_path,
        &input_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(EXAMPLE, farem, toolchain_version, LOGO);
