use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/python/example.py").trim()
}

fn toolchain_version() -> String {
    // We have to hard code this here because the toolchain itself is not available in the
    // runtime
    "3.10.2+".to_string()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    Ok((code.as_bytes().to_vec(), "0ms".to_string()))
}

proto_server!(example, compile, toolchain_version);
