FROM node:5
MAINTAINER Andrew Shankie <andrew@properdesign.rs>


# RUN apt-get update
# RUN apt-get install -y bzip2 ruby ruby-dev build-essential git
# RUN apt-get clean

# RUN gem install compass

WORKDIR /build

# This slightly convoluted package.json process is so that we can cache the results of the install, while being able to edit scripts
ADD packageAdditions.json /build/
ADD packageDependencies.json /build/

RUN cp packageDependencies.json package.json

RUN npm install

RUN rm package.json

ADD . /build/
ADD ./js /js

RUN node js/mergePackages.js

RUN mkdir /source # In case we're building on the server and not volume-mapping in

ADD entrypoint.sh /

#WORKDIR /source

#RUN npm link gulp

ENTRYPOINT ["/entrypoint.sh"]