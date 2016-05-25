#!/bin/bash

# Probably worth adding this in your path. Do something like this:
# TMPDIR=$(dirname $(mktemp -u)) && \
#   curl -sLo "$TMPDIR/properbuild.zip" "https://github.com/shankiesan/proper-build/archive/master.zip" && \
#   unzip -jq -o "$TMPDIR/properbuild.zip" -d $TMPDIR && \
#   cp "$TMPDIR/proper-build-master/proper-build.sh" /usr/local/bin/proper-build

# Pull the latest image if we're asked
if [ "$1" == "pull" ]; then 
  docker pull properdesign/proper-build
  exit
fi

docker run --rm -ti \
    --name=proper-build \
    -v $(PWD):/source \
    properdesign/proper-build "$@"
