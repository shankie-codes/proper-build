FROM node:5
MAINTAINER Andrew Shankie <andrew@properdesign.rs>


# RUN apt-get update
# RUN apt-get install -y bzip2 ruby ruby-dev build-essential git
# RUN apt-get clean

# RUN gem install compass

WORKDIR /build

ADD package.json /build/

RUN npm install

ADD . /build/
ADD ./js /js

RUN mkdir /source # In case we're building on the server and not volume-mapping in

ADD entrypoint.sh /

#WORKDIR /source

#RUN npm link gulp

ENTRYPOINT ["/entrypoint.sh"]