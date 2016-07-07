#!/bin/bash

set -e

PROJECTS=(./components ./extension ./home/web ./signer/web ./status/web)
CMD="help"

# Parse CLI
while :
do
  case "$1" in
    install | i)
      CMD="install"
      shift 1
      ;;
    clean | c)
      CMD="clean"
      shift 1
      ;;
    help | h)
      CMD="help"
      shift 1
      ;;
    *)
      break
      ;;
  esac
done

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
  clean)
    set -x
    for P in ${PROJECTS[@]}; do
      cd $P
      rm -rf node_modules
      cd -
    done
    ;;
  *)
    echo "Unknown option"
    exit 1
    ;;
esac
