FROM mcr.microsoft.com/devcontainers/typescript-node:20-bookworm
WORKDIR "/workspaces/table_assignment"
ARG USERNAME=node
ENV NG_FORCE_TTY=false
RUN npm install -g @angular/cli@^18.0.1
RUN npm install -g husky@^8.0.3
RUN ng analytics disable --global true

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME /commandhistory \
    && echo "$SNIPPET" >> "/home/$USERNAME/.bashrc"