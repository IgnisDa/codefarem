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

RUN printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.cargo/bin\n' >> /etc/profile.d/cargo.sh ;\
    printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.local/bin\n' >> /etc/profile.d/edgedb.sh ;\
    chmod +x /etc/profile.d/cargo.sh ;\
    chmod +x /etc/profile.d/edgedb.sh

RUN set -eu ;\
    cd /tmp ;\
    npm install -g yarn ;\
    wget "https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz" -O "cargo-binstall.tgz" ;\
    tar zxvf "cargo-binstall.tgz" ;\
    mv "cargo-binstall" "/usr/bin/cargo-binstall"

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

RUN for pkg in emscripten protobuf protolint grpcurl-bin python-poetry; do paru -S --noconfirm $pkg; done

RUN set -eu ;\
    cd /tmp ;\
    wget "https://github.com/moonrepo/moon/releases/latest/download/moon-x86_64-unknown-linux-musl" -O "moon" ;\
    sudo mv "moon" "/usr/bin/moon" ;\
    sudo chmod +x "/usr/bin/moon" ;\
    cargo binstall cargo-nextest cargo-watch --no-confirm

RUN export WASI_VERSION=16 ;\
    export WASI_VERSION_FULL=${WASI_VERSION}.0 ;\
    curl -sSf -L -O "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_VERSION}/wasi-sdk-${WASI_VERSION_FULL}-linux.tar.gz" ;\
    mkdir -p /opt/wasi-sdk ;\
    tar --strip-components=1 -C /opt/wasi-sdk -xvf wasi-sdk-${WASI_VERSION_FULL}-linux.tar.gz ;\
    rm -f wasi-sdk-${WASI_VERSION_FULL}-linux.tar.gz
