#!/usr/bin/env bash

# setup the git identities
git config --global user.name "${GIT_AUTHOR_NAME}"
git config --global user.email "${GIT_AUTHOR_EMAIL}"

# install project specific tools
rustup target add wasm32-wasi
sudo apt install emscripten
curl https://wasmtime.dev/install.sh -sSf | bash
sudo cp ~/.wasmtime/bin/wasmtime /usr/bin/

# install cargo tools
_binstall_url="https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz"
wget $_binstall_url -O /tmp/cargo-binstall.tgz
tar zxvf /tmp/cargo-binstall.tgz
sudo mv cargo-binstall /usr/bin/
cargo binstall cargo-nextest cargo-watch --no-confirm

# initialize edgedb project
cd apps/farem-main
edgedb project init --non-interactive
