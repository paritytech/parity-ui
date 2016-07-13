#!/bin/bash

set -e

PROJECTS=(./components ./home/web ./signer/web ./status/web ./extension)
CMD="help"

# Parse CLI
case "$1" in
  install | i)
    CMD="install"
    ;;
  clean | c)
    CMD="clean"
    ;;
  build | b)
    CMD="build"
    ;;
  test | t)
    CMD="test"
    ;;
  shrinkwrap)
    CMD="shrinkwrap"
    ;;
  *)
    break
    ;;
esac

# Run Command
case "$CMD" in
  help)
    echo "Options: install, clean, shrinkwrap, build, test, help"
    ;;
  install)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm install
      cd -
    done
    ;;
  clean)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      rm -rf node_modules
      cd -
    done
    ;;
  build)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm install --no-progress --ignore-scripts
      NODE_ENV="production" npm run build
      cd -
    done
    ;;
  test)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm run test
      cd -
    done
    ;;
  shrinkwrap)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm install --no-progress --ignore-scripts
      npm prune --production=false
      npm shrinkwrap --dev
      cd -
    done
    ;;
  *)
    echo "Unknown command: $CMD"
    exit 1
    ;;
esac
