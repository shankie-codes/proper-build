FROM node:5-slim
MAINTAINER Andrew Shankie <andrew@properdesign.rs>

RUN npm -g install browser-sync
RUN npm install -g gulp

RUN apt-get update
RUN apt-get install -y bzip2 ruby ruby-dev build-essential
RUN apt-get clean

RUN gem install compass

# We only needed these to build Compass
RUN apt-get remove -y ruby-dev build-essential

WORKDIR /gulp

ADD package.json /gulp/

RUN npm install

ADD gulpfile.js /gulp

#WORKDIR /source

#RUN npm link gulp

ENTRYPOINT ["gulp"]