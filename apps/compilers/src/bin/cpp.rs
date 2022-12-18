use compilers::{generate_input_and_output_files, run_command_and_capture_output};
use duct::cmd;
use macros::proto_server;
use utilities::get_command_output;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/cpp/example.cpp").trim()
}

fn toolchain_info() -> String {
    get_command_output("zig", &["version"]).unwrap()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("cpp", code);
    let command = cmd!(
        "zig",
        "build-exe",
        &input_file_path,
        "-O",
        "ReleaseSmall",
        "-target",
        "wasm32-wasi",
        "-lc++",
        format!("-femit-bin={}", output_file_path.to_str().unwrap())
    );
    run_command_and_capture_output(command, &output_file_path)
}

proto_server!(example, compile, toolchain_info);
