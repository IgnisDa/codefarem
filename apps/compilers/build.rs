use utilities::write_output_of_command_to_file;

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
