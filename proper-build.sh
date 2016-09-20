#!/bin/bash

# Probably worth adding this in your path. Do something like this:
# TMPDIR=$(dirname $(mktemp -u)) && \
#   curl -sLo "$TMPDIR/properbuild.zip" "https://github.com/shankiesan/proper-build/archive/master.zip" && \
#   unzip -jq -o "$TMPDIR/properbuild.zip" -d $TMPDIR && \
#   cp "$TMPDIR/proper-build.sh" /usr/local/bin/proper-build

# Check if there's a build tool (i.e. proper-build branch) specified in proper-config
BUILD_TOOL=$(docker run -v ${PWD}/proper-config.json:/node/proper-config.json node:5 node -e 'var config = require("/node/proper-config.json"); if(config.build){console.log(config.build.buildTool);} else{console.log("webpack");}')

if [ "$BUILD_TOOL" == "undefined" ]; then
  BUILD_TOOL="latest"
fi

# Pull the latest image if we're asked
if [ "$1" == "pull" ]; then
  docker pull properdesign/proper-build:$BUILD_TOOL
  exit
fi

BUILD_CONTAINER_ID=$(docker ps -a --filter name=proper-build --format "{{.ID}}")
APP_CONTAINER_NAME=${PWD##*/}
APP_HOST_PATH=$(docker exec -it $APP_CONTAINER_NAME /bin/bash -c 'echo $VIRTUAL_HOST')

# Remove the container if it's hanging around
if [ -n "$BUILD_CONTAINER_ID" ]; then
  docker rm -f $BUILD_CONTAINER_ID
fi

# Check if 'local' was our first parameter. If it was, shift the first argument and do some other things
if [ "$1" == 'local' ]; then
  IMAGE_NAME='proper-build'
  (cd ~/Sites/proper-build && make build)
  shift
else
  IMAGE_NAME="properdesign/proper-build:$BUILD_TOOL"
fi

docker run --rm -ti \
    --name=proper-build \
    --link httpsportallocal_nginx_1:$APP_HOST_PATH \
    -e "APP_HOST_PATH=$APP_HOST_PATH" \
    -p 3000:3000 \
    -p 3001:3001 \
    -p 8888:8888 \
    -v $(PWD):/source \
    $IMAGE_NAME "$@"
