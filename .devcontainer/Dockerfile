FROM archlinux

ENV UUID=1000
ENV GUID=${UUID}
ENV USERNAME=vscode

RUN pacman -Syyu --noconfirm reflector ;\
    reflector --latest 20 --protocol https --sort rate --save /etc/pacman.d/mirrorlist ;\
    pacman -S --noconfirm --needed base-devel git sudo

RUN groupadd -g ${GUID} ${USERNAME} ;\
    useradd -ms /bin/bash ${USERNAME} -u ${UUID} -g ${USERNAME} -g wheel ;\
    echo "ALL ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} ;\
    chmod 0440 /etc/sudoers.d/${USERNAME}

RUN for pkg in rustup nodejs npm python3 go tinygo fish curl wget python-pip zig; do pacman -S --noconfirm $pkg; done

RUN printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.cargo/bin\n' >> /etc/profile.d/paths.sh ;\
    printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.local/bin\n' >> /etc/profile.d/paths.sh ;\
    printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.moon/tools/moon/latest\n' >> /etc/profile.d/paths.sh ;\
    chmod +x /etc/profile.d/paths.sh

RUN set -eu ;\
    cd /tmp ;\
    npm install -g yarn ;\
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

USER $USERNAME

RUN set -eu ;\
    npm config set store-dir "$HOME/.store" ;\
    curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh -s -- -y --no-modify-path --verbose ;\
    curl "https://wasmtime.dev/install.sh" -sSf | bash ;\
    sudo cp "$HOME/.wasmtime/bin/wasmtime" "/usr/bin/wasmtime" ;\
    rustup default "1.65" ;\
    rustup target add "wasm32-wasi"

RUN set -eu ;\
    cd /tmp ;\
    wget "https://github.com/Morganamilo/paru/releases/download/v1.11.2/paru-v1.11.2-x86_64.tar.zst" ;\
    tar -xvf "paru-v1.11.2-x86_64.tar.zst" ;\
    sudo mv "paru" "/usr/bin/paru"

RUN for pkg in \
    "protobuf" "protolint" "grpcurl-bin" "python-poetry" \
    "alsa-lib" "gtk3" "at-spi2-core" "nss" "xorg-server-xvfb"; \
    do paru -S --noconfirm $pkg; done

RUN curl -fsSL https://moonrepo.dev/install.sh | bash

RUN cargo binstall cargo-nextest cargo-watch --no-confirm
