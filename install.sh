#!/bin/bash

set -e
set -x

PROJECTS=(./components ./extension ./home ./signer ./status)

for P in ${PROJECTS[@]}; do
  cd $P
  npm install
  cd -
done
