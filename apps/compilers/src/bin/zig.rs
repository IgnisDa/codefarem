use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;
use std::fs;
use utilities::CODEFAREM_TEMP_PATH;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/zig/example.zig").trim()
}

fn compile(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("zig", code);
    let command = cmd!(
        "zig",
        "build-exe",
        &input_file_path,
        "-O",
        "ReleaseSmall",
        "-target",
        "wasm32-wasi"
    )
    // TODO: Figure out how to set the output filename directly via CLI args
    .dir(CODEFAREM_TEMP_PATH.clone());
    run_command_and_capture_output(command, &output_file_path, || {
        let mut created_wasm_file = input_file_path;
        created_wasm_file.set_extension("wasm");
        fs::rename(created_wasm_file, &output_file_path).unwrap();
    })
}

proto_server!(example, compile);
