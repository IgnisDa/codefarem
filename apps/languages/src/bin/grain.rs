use duct::cmd;
use languages::{generate_input_and_output_files, run_command_and_capture_output};
use macros::proto_server;
use proc_macros::embed_image_as_base64;
use utilities::get_command_output;

const LOGO: &str = embed_image_as_base64!("logo/grain.png");
const EXAMPLE: &str = include_str!("../../../../libs/examples/src/grain/example.gr");

fn toolchain_version() -> String {
    get_command_output("grain", &["--version"]).unwrap()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("gr", code);
    let command = cmd!(
        "grain",
        "compile",
        &input_file_path,
        "-o",
        &output_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(EXAMPLE, compile, toolchain_version, LOGO);
