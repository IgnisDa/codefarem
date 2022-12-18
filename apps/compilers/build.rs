use std::{env, fs, process::Command};

use anyhow::{bail, Result};

fn write_output_of_command_to_file(command: &str, args: &[&str], file: &str) -> Result<()> {
    let out_dir = env::var("OUT_DIR").unwrap();
    let cmd_output = Command::new(command).args(args).output();
    match cmd_output {
        Ok(output) => {
            let version = String::from_utf8(output.stdout).unwrap();
            let path = format!("{}/{}", out_dir, file);
            fs::write(path, &version).unwrap();
            Ok(())
        }
        Err(e) => bail!("Failed to execute {}: {}", command, e),
    }
}

fn main() {
    // for c, cpp and zig
    write_output_of_command_to_file("zig", &["version"], "zig_version.txt").ok();
    // for go
    write_output_of_command_to_file("tinygo", &["version"], "go_version.txt").ok();
    // for rust
    write_output_of_command_to_file("rustc", &["--version"], "rust_version.txt").ok();
    // for python
    write_output_of_command_to_file("python", &["--version"], "python_version.txt").ok();
    // for swift
    write_output_of_command_to_file("swift", &["--version"], "swift_version.txt").ok();
}
