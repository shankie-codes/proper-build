FROM node:5
MAINTAINER Andrew Shankie <andrew@properdesign.rs>


# RUN apt-get update
# RUN apt-get install -y bzip2 ruby ruby-dev build-essential git
# RUN apt-get clean

# RUN gem install compass

WORKDIR /build

# This slightly convoluted package.json process is so that we can cache the results of the install, while being able to edit scripts
ADD packageDependencies.json /build/

RUN cp packageDependencies.json package.json

RUN npm install

RUN rm package.json

ADD . /build/
ADD ./js /js

ADD packageAdditions.json /build/
RUN node js/mergePackages.js

RUN mkdir /source # In case we're building on the server and not volume-mapping in

ENV npm_config_loglevel error
# RUN npm config set jsSrcDir "npm set in dockerfile"
ADD entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]