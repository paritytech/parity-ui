#!/bin/bash

set -e
set -x

PROJECTS=(home signer status wallet)

for PROJECT in ${PROJECTS[@]}; do
  cd $PROJECT
  cargo build
  cargo test
  cd -
done

exit 0
