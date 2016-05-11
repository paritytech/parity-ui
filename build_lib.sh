#!/bin/sh

set -x
set -e

cd src/web
../../../parity-webapp/generate/index.js > ../lib.rs

