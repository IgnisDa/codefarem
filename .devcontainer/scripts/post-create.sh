#!/usr/bin/env bash

# setup the git identities
git config --global user.name "${GIT_AUTHOR_NAME}"
git config --global user.email "${GIT_AUTHOR_EMAIL}"

# set nightly as the default toolchain
rustup default nightly

# initialize edgedb project
cd apps/farem-main
edgedb project init --non-interactive
