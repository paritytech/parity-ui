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
    echo "Options: install, clean, help"
    ;;
  install)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm install
      cd -
    done
    ;;
  shrinkwrap)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      npm install --ignore-scripts
      npm prune --production=false
      npm shrinkwrap --dev
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
  *)
    echo "Unknown command: $CMD"
    exit 1
    ;;
esac
