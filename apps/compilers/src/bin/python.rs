use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/python/example.py").trim()
}

fn compile(_code: &'_ str) -> Result<Vec<u8>, Vec<u8>> {
    Ok(vec![])
}

proto_server!(example, compile);
