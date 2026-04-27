
FROM quay.io/fedora/fedora-toolbox:44

# Install dependencies core to TutorFin:
# - python3, nodejs, npm for web and jupyter apps
# - beancount, hledger, ledger for plaintext accounting tests
# - chromium for headless playright e2e
# - System libraries often needed for headless testing
RUN --mount=type=cache,id=dnf,target=/var/cache/dnf,sharing=locked \
    sudo dnf update -y && \
    sudo dnf install -y \
    python3 \
    python3-pip \
    python3-devel \
    gcc \
    gcc-c++ \
    make \
    nodejs \
    npm \
    yarn \
    git \
    curl \
    wget \
    sudo \
    beancount \
    hledger \
    ledger \
    chromium \
    alsa-lib \
    at-spi2-atk \
    at-spi2-core \
    cups-libs \
    libdrm \
    libxkbcommon \
    mesa-libgbm \
    gtk3 \
    pnpm
    #&& sudo dnf clean all

# Devcontainers natively log in as root unless configured. We'll set up a 'vscode' user mapped to UID 1000.
RUN sudo useradd -s /bin/bash -u 1000 -m vscode || true \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/nopasswd \
    && sudo chmod 0440 /etc/sudoers.d/nopasswd

# Setup the primary user
USER vscode
WORKDIR /workspace

# Disable Next.js anonymous telemetry without requiring the `next` CLI at build time.
RUN mkdir -p /home/vscode/.config/nextjs-nodejs \
    && echo '{"telemetry":{"enabled":false}}' > /home/vscode/.config/nextjs-nodejs/config.json