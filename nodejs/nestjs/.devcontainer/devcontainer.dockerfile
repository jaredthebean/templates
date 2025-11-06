FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt-get update && apt-get install -y curl fontconfig git ssh vim zsh
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN cargo install \
  bat \
  eza \
  fd-find \
  git-delta \
  ripgrep \
  tealdeer \
  tokei
# Needed for vim coc
RUN curl -sL install-node.vercel.app/lts | bash -s -- -f
RUN chsh -s /usr/bin/zsh
