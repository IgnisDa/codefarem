FROM archlinux

ENV UUID=1000
ENV GUID=${UUID}
ENV USERNAME=vscode

RUN pacman -Syyu --noconfirm --needed base-devel git sudo

RUN groupadd -g ${GUID} ${USERNAME} ; \
    useradd -ms /bin/bash ${USERNAME} -u ${UUID} -g ${USERNAME} -g wheel ; \
    echo "ALL ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} ;\
    chmod 0440 /etc/sudoers.d/${USERNAME}

RUN pacman -S --noconfirm rustup nodejs npm python3 go tinygo fish curl wget

RUN printf '#!/bin/sh\nexport PATH=$PATH:$HOME/.cargo/bin\nexport RUSTC_WRAPPER=sccache' >> /etc/profile.d/cargo.sh ;\
    chmod +x /etc/profile.d/cargo.sh

RUN set -eu ;\
    npm install --global pnpm ;\
    curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh -s -- -y --no-modify-path --verbose ;\
    mv "/root/.local/bin/edgedb" "/usr/local/bin/edgedb" ;\
    chmod +x "/usr/local/bin/edgedb" ;\
    wget "https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz" -O "/tmp/cargo-binstall.tgz" ;\
    tar zxvf "/tmp/cargo-binstall.tgz" ;\
    mv cargo-binstall "/usr/bin/"

USER $USERNAME

RUN set -eu ;\
    npm config set store-dir "$HOME/.store" ;\
    curl "https://wasmtime.dev/install.sh" -sSf | bash ;\
    sudo cp "$HOME/.wasmtime/bin/wasmtime" "/usr/bin/" ;\
    rustup default nightly ;\
    rustup target add wasm32-wasi ;\
    cargo binstall cargo-nextest cargo-watch sccache --no-confirm

RUN set -eu ;\
    git clone https://aur.archlinux.org/paru.git /tmp/paru ;\
    cd /tmp/paru && makepkg -si --noconfirm ;\
    paru -S --noconfirm emscripten
