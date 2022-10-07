use compilers::{generate_input_and_output_files, main_function, run_command_and_capture_output};
use duct::cmd;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/rs/example.rs").trim()
}

fn farem(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    let (input_file_path, output_file_path) = generate_input_and_output_files("rs", code);
    let command = cmd!(
        "rustc",
        &input_file_path,
        "--target",
        "wasm32-wasi",
        "-o",
        &output_file_path
    );
    run_command_and_capture_output(command, &output_file_path)
}

main_function!(example, farem);
