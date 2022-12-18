use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/swift/example.swift").trim()
}

fn compile(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("swift", code);
    let command = cmd!(
        "swiftc",
        &input_file_path,
        "-target",
        "wasm32-unknown-wasi",
        "-o",
        &output_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(example, compile);
