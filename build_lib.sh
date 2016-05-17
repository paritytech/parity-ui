#!/bin/sh

set -x
set -e

cd src/web
FULL_NAME="Ethereum Wallet" ../../../parity-webapp/generate/index.js > ../lib.rs

