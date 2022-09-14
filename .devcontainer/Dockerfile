ARG VARIANT=18
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# install edgedb cli
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh -s -- -y --no-modify-path --verbose ;\
    mv "/root/.local/bin/edgedb" "/usr/local/bin/edgedb" ;\
    chmod +x "/usr/local/bin/edgedb"


RUN su node -c "npm install --global pnpm && npm config set store-dir ~/.store" ;\
    # install global node tools and set the store directory
    curl https://raw.githubusercontent.com/IgnisDa/developrs/main/apps/esteem/install.sh | sh -s -- --yes ;\
    # Install the esteem cli to make it easier to manage nx monorepos
    wget -O tokei.tar.gz https://github.com/XAMPPRocky/tokei/releases/latest/download/tokei-x86_64-unknown-linux-gnu.tar.gz ;\
    tar xf tokei.tar.gz -C /usr/local/bin ;\
    tokei --version
    # Install tokei to count code count
