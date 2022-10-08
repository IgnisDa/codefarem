use std::path::PathBuf;

fn main() {
    let root = PathBuf::from(env!("CARGO_WORKSPACE_DIR"));
    let proto_path = root.join("libs").join("protobuf").join("src");
    let files = vec!["farem"]
        .iter()
        .map(|p| {
            let path = proto_path.join(format!("{p}.proto"));
            println!("cargo:rerun-if-changed={}", path.to_string_lossy());
            path
        })
        .collect::<Vec<_>>();
    prost_build::compile_protos(files.as_slice(), &[proto_path.to_str().unwrap()]).unwrap();
}
