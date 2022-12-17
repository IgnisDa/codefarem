use duct::Expression;
use log::{error, info};
use std::{fs, path::PathBuf};
use utilities::generate_random_file;

pub fn generate_input_and_output_files(extension: &'_ str, code: &'_ str) -> (PathBuf, PathBuf) {
    let (_, input_file_path) = generate_random_file(Some(extension)).unwrap();
    fs::write(&input_file_path, code).unwrap();
    let (_, output_file_path) = generate_random_file(Some("wasm")).unwrap();
    (input_file_path, output_file_path)
}

pub fn run_command_and_capture_output<F>(
    command: Expression,
    output_file_path: &PathBuf,
    after_cmd_fn: F,
) -> Result<Vec<u8>, Vec<u8>>
where
    F: FnOnce(),
{
    info!("Running command: {:?}", command);
    let output = command.unchecked().stderr_capture().run().unwrap();
    after_cmd_fn();
    if output.status.success() {
        info!("Compiled to {:?} successfully", output_file_path);
        Ok(fs::read(output_file_path).unwrap())
    } else {
        error!(
            "Compilation unsuccessful, with status: {:?} ",
            output.status
        );
        Err(output.stderr)
    }
}
