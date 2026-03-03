FROM mcr.microsoft.com/devcontainers/base:bookworm

ENV NVM_DIR=/usr/local/share/nvm
COPY .nvmrc /tmp/.nvmrc
RUN mkdir -p "$NVM_DIR" && \
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && bash -c "source ${NVM_DIR}/nvm.sh \
        && nvm install $(cat /tmp/.nvmrc) \
        && nvm alias default $(cat /tmp/.nvmrc) \
        && npm install -g @angular/cli firebase-tools" \
    && echo "export NVM_DIR='$NVM_DIR'" >> /etc/bash.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" ' >> /etc/bash.bashrc

RUN apt-get update \
    && apt-get install -y --no-install-recommends wget apt-transport-https gpg \
    && wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor -o /usr/share/keyrings/adoptium.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/adoptium.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends temurin-21-jdk maven ant gradle groovy chromium \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*