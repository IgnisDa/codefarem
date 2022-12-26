use macros::proto_server;
use proc_macros::embed_image_as_base64;

const LOGO: &str = embed_image_as_base64!("logo/python.png");
const EXAMPLE: &str = include_str!("../../../../libs/examples/src/python/example.py");

fn toolchain_version() -> String {
    // We have to hard code this here because the toolchain itself is not available in the
    // runtime
    "3.10.2+".to_string()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    Ok((code.as_bytes().to_vec(), "0ms".to_string()))
}

proto_server!(EXAMPLE, compile, toolchain_version, LOGO);
