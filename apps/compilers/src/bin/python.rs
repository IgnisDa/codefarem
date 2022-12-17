use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/python/example.py").trim()
}

fn compile(code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    Ok(code.as_bytes().to_vec())
}

proto_server!(example, compile);
