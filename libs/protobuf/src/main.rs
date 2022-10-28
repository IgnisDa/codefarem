use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_path = PathBuf::from(file!())
        .parent()
        .expect("Could not get parent")
        .to_path_buf();
    let definitions_path = proto_path.join("definitions");
    let output_path = PathBuf::from(file!())
        .parent()
        .expect("Could not get parent")
        .join("generated");
    for p in vec!["compilers", "executor"].iter() {
        let path = definitions_path.join(format!("{p}.proto"));
        tonic_build::configure()
            .out_dir(output_path.clone())
            .compile(&[path], &[&definitions_path])?;
    }
    Ok(())
}
