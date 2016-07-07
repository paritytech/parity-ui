#!/bin/bash

set -e
set -x

PROJECTS=(./components ./extension ./home/web ./signer/web ./status/web)

for P in ${PROJECTS[@]}; do
  cd $P
  npm install
  cd -
done
