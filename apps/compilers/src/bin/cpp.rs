use compilers::{generate_input_and_output_files, main_function, run_command_and_capture_output};
use duct::cmd;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/cpp/example.cpp").trim()
}

fn farem(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
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

main_function!(example, farem);
