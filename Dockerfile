FROM ubuntu:20.04

EXPOSE 3000
ENV TZ=America/Toronto NODE_OPTIONS="--max-old-space-size=8192"

RUN apt update && apt upgrade -y; \
    apt install -y wget vim gnupg curl; \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash; \
    bash -ic 'source ~/.bashrc; source ~/.nvm/nvm.sh; nvm install 14; nvm use 14;'; \
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -; \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list; \
    apt-get update && apt-get install -y mongodb-org

WORKDIR /app

COPY / .
RUN mkdir data

RUN bash -c 'source ~/.nvm/nvm.sh; nvm use 14; npm install'
CMD bash -c '\
      source ~/.nvm/nvm.sh; nvm use 14; \
      mongod --dbpath /app/data --fork --syslog; \
      node server.js; \
    '
