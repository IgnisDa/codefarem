use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;

const VERSION: &str = include_str!(concat!(env!("OUT_DIR"), "/go_version.txt"));

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/go/example.go").trim()
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

proto_server!(example, farem);
