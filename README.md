# Codefarem

Codefarem aims to be an online platform that enables teachers to teach their students how
to code in a hands-on environment.

## How it works

Codefarem employs a microservices architecture. Here is a high level sequence diagram of
how it works:

```mermaid
sequenceDiagram

    actor Client;
    participant Orchestrator;
    participant Compiler;
    participant Executor;
    Client ->> Orchestrator: req. to execute code
    note over Orchestrator: select compiler according to language
    Orchestrator ->> Compiler: request compilation
    note over Compiler: compile code
    Compiler ->> Orchestrator: return compiled code (or error)
    Orchestrator -->> Client: error if compilation failed
    Orchestrator ->> Executor: request execution
    note over Executor: execute compiled code
    Executor ->> Orchestrator: return execution result (or error)
    Orchestrator ->> Client: return execution result
    Orchestrator -->> Client: return execution error
```

## Motivation

I started this project to teach myself the newest technologies of the web, and as such this
project uses bleeding edge technologies to achieve its goals. Here is a non exhaustive list of
the technologies used:

- [Edgedb][edgedb]: Database for backend
- [Hanko][hanko]: Authentication provider
- [Remix][remix]: Framework used for the main website
- [Vite][vite]: Framework used for the admin website
- [Mantine][mantine]: Frontend framework in admin website
- [Tinygo][tinygo]: Compiling `Go` to `wasm`
- [Rust Wasi][rust-wasm32]: Compiling `Rust` to `wasm`
- [Zig][zig]: Compiling `Zig`, `C` and `Cpp` to `wasm`
- [Python-Wasi][python-wasi]: Executing `Python` in a `wasm` environment
- [Wasmtime][wasmtime]: Executing the compiled `wasm` output
- [Docker][docker]: Containerization of the microservices

[edgedb]: https://edgedb.com
[hanko]: https://hanko.io
[remix]: https://remix.run
[mantine]: https://mantine.dev
[vite]: https://vitejs.dev
[tinygo]: https://tinygo.org
[rust-wasm32]: https://github.com/bytecodealliance/cargo-wasi
[wasmtime]: https://wasmtime.dev
[zig]: https://ziglang.org
[python-wasi]: https://github.com/singlestore-labs/python-wasi
[docker]: https://docker.com
