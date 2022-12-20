use macros::proto_server;

async fn example() -> &'static str {
    include_str!("../../../../libs/examples/src/ruby/example.rb").trim()
}

fn toolchain_version() -> String {
    // We have to hard code this here because the toolchain itself is not available in the
    // runtime
    "ruby 3.2.0dev (2022-11-11T22:40:31Z master 0a9d51ee9d) [wasm32-wasi]".to_string()
}

fn compile(code: &'_ str) -> Result<(Vec<u8>, String), Vec<u8>> {
    Ok((code.as_bytes().to_vec(), "0ms".to_string()))
}

proto_server!(example, compile, toolchain_version);
