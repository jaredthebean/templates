#!/usr/bin/env sh

# Doesn't handle if we are in a symlink, but :shrug:
readonly SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

TYPE_NAME="$1"
TYPE_DIR="${SCRIPT_DIR}/${TYPE_NAME}"
if [ "${TYPE_NAME}" = "" -o ! -d "${TYPE_DIR}" ]; then
  dirs=""
  for FILE in "${SCRIPT_DIR}"/*; do
    if [ -d "${FILE}" ]; then
      filename=$(basename "${FILE}")
      if [ "${dirs}" = "" ]; then
        dirs="${filename}"
      else
        dirs="${dirs} ${filename}"
      fi
    fi
  done
  echo "Usage: "$0" <${dirs}>"
  exit 1
fi

mkdir -p .devcontainer
cp -r ${TYPE_DIR}/* .devcontainer
