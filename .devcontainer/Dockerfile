FROM ignisda/archlinux:latest

USER root

RUN for pkg in go tinygo zig; do pacman -S --noconfirm $pkg; done

RUN set -eu ;\
    cd /tmp ;\
    wget "https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz" -O "cargo-binstall.tgz" ;\
    tar zxvf "cargo-binstall.tgz" ;\
    mv "cargo-binstall" "/usr/bin/cargo-binstall"

RUN wget "https://github.com/singlestore-labs/python-wasi/releases/download/v3.10-alpha/wasi-python-3.10.tgz" ;\
    tar xf "wasi-python-3.10.tgz" --strip-components=1 -C /opt ;\
    rm -rf "wasi-python-3.10.tgz"

RUN wget 'https://github.com/swiftwasm/swift/releases/download/swift-wasm-5.7-SNAPSHOT-2022-11-09-a/swift-wasm-5.7-SNAPSHOT-2022-11-09-a-ubuntu22.04_x86_64.tar.gz' ;\
    tar xf 'swift-wasm-5.7-SNAPSHOT-2022-11-09-a-ubuntu22.04_x86_64.tar.gz' --strip-components=2 -C /usr/local ;\
    rm -rf 'swift-wasm-5.7-SNAPSHOT-2022-11-09-a-ubuntu22.04_x86_64.tar.gz'

RUN curl -LO 'https://github.com/ruby/ruby.wasm/releases/latest/download/ruby-head-wasm32-unknown-wasi-full.tar.gz' ;\
    tar xf 'ruby-head-wasm32-unknown-wasi-full.tar.gz' --strip-components=2 --one-top-level=wasi-ruby -C /opt ;\
    rm -rf 'ruby-head-wasm32-unknown-wasi-full.tar.gz'

RUN curl -L --output /usr/local/bin/grain h"ttps://github.com/grain-lang/grain/releases/download/grain-v0.5.11/grain-linux-x64" ;\
    chmod +x /usr/local/bin/grain

USER $USERNAME

RUN set -eu ;\
    curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh -s -- -y --no-modify-path --verbose ;\
    curl "https://wasmtime.dev/install.sh" -sSf | bash ;\
    sudo cp "$HOME/.wasmtime/bin/wasmtime" "/usr/bin/wasmtime" ;\
    rustup default "1.65" ;\
    rustup target add "wasm32-wasi"

RUN for pkg in \
    "protobuf" "protolint" "grpcurl-bin" "python-poetry" \
    "alsa-lib" "gtk3" "at-spi2-core" "nss" "xorg-server-xvfb"; \
    do paru -S --noconfirm $pkg; done
