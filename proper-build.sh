#!/bin/bash

# Probably worth adding this in your path. Do something like this:
# TMPDIR=$(dirname $(mktemp -u)) && \
#   curl -sLo "$TMPDIR/properbuild.zip" "https://github.com/shankiesan/proper-build/archive/master.zip" && \
#   unzip -jq -o "$TMPDIR/properbuild.zip" -d $TMPDIR && \
#   cp "$TMPDIR/proper-build.sh" /usr/local/bin/proper-build

# Pull the latest image if we're asked
if [ "$1" == "pull" ]; then 
  docker pull properdesign/proper-build
  exit
fi

BUILD_CONTAINER_ID=$(docker ps --filter name=newmet --format "{{.ID}}")

# Remove the container if it's hanging around
if [ ! -z $BUILD_CONTAINER_ID ]; then
  docker rm -f $BUILD_CONTAINER_ID
fi

docker run --rm -ti \
    --name=proper-build \
    -v $(PWD):/source \
    properdesign/proper-build "$@"
