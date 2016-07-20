#!/bin/bash

set -e
set -x

git clone https://${PARITY_PUSH_TOKEN}@github.com/ethcore/parity.git --depth 1
cd parity
cargo update -p parity-dapps
git checkout -b auto-ui-update
git commit -am "Bumping Parity UI"
git push --force -u origin auto-ui-update

