#!/bin/bash

set -e
set -x

./web.sh build
./web.sh test
