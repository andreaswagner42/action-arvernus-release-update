FROM debian:stable-slim

LABEL "com.github.actions.name"="Arvernus Release Package Update"
LABEL "com.github.actions.description"="Deploy to the Arvernus Package Repository"
LABEL "com.github.actions.icon"="upload-cloud"
LABEL "com.github.actions.color"="green"

LABEL maintainer="Fabian Kägy <fabian@arvernus.info>"
LABEL version="1.0.0"
LABEL repository="http://github.com/Arvernus/actions-arvernus-release-update"

RUN apt-get update \
    && apt-get install -y httpie rsync zip \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]