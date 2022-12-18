use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;

const VERSION: &str = include_str!(concat!(env!("OUT_DIR"), "/zig_version.txt"));

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/c/example.c").trim()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("c", code);
    let command = cmd!(
        "zig",
        "build-exe",
        &input_file_path,
        "-O",
        "ReleaseSmall",
        "-target",
        "wasm32-wasi",
        "-lc",
        format!("-femit-bin={}", output_file_path.to_str().unwrap())
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(example, compile);
