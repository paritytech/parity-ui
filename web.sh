#!/bin/bash

set -e

PROJECTS=(./components ./extension ./home/web ./signer/web ./status/web)
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
      npm shrinkwrap
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
