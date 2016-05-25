#!/bin/bash

docker run --rm -ti \
    --name=proper-build \
    -v $(PWD):/source \
    properdesign/proper-build "$@"
