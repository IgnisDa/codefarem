use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/cpp/example.cpp").trim()
}

fn compile(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("cpp", code);
    let command = cmd!(
        "emcc",
        &input_file_path,
        "-s",
        "STANDALONE_WASM",
        "-o",
        &output_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(example, compile);
