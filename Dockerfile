FROM node:11.7.0
# REF: https://hub.docker.com/_/node

# Install Utils
RUN apt-get update && apt-get -y upgrade && \
    apt-get -y install apt-utils && \
    apt-get -y install traceroute mtr iputils-tracepath iputils-ping telnet mc whois dnsutils tcpdump nmap python-pip snmp jq lsof htop expect-dev bridge-utils graphicsmagick

# Create app directory structure
RUN mkdir -p /opt/botkit/help
RUN mkdir -p /opt/botkit/lib
RUN mkdir -p /opt/botkit/skills

# Set Docker working directory
WORKDIR /opt/botkit

# Copy in app dependencies
COPY .env /opt/botkit/.env
COPY *.js /opt/botkit/
COPY *.json /opt/botkit/
COPY help/*.js /opt/botkit/help/
COPY lib/*.js /opt/botkit/lib/
COPY skills/*.js /opt/botkit/skills/

# Install Node.js modules
RUN npm install

CMD [ "npm", "start" ]