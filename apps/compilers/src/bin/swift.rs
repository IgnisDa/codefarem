use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;
use utilities::get_command_output;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/swift/example.swift").trim()
}

fn toolchain_info() -> String {
    get_command_output("swift", &["--version"]).unwrap()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
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

proto_server!(example, compile, toolchain_info);
