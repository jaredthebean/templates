#!/usr/bin/env sh

# Functions
usage() {
  echo "Copies a template to the current directory - running any install scripts found in the template" >&2
  echo "Repo: ${REMOTE}" >&2
  if [ -z "$1" ]; then
    echo "Usage: $0 <LANG> [OPT]" >&2
    if [ -n "${LANGS}" ]; then
      echo "Available languages: ${LANGS}" >&2
    fi
  else
    echo "Usage: $0 $1 [OPT]" >&2
    echo "Available options for $1: ${OPTS}" >&2
  fi
}
listDirs() {
  if [ $# = 0 ]; then
    return 1
  fi
  DIR="$1"
  local filepath
  for filepath in "${DIR}"/*; do
    if [ -d "${filepath}" ]; then
      basename "${filepath}" | tr '\n' ' '
    fi
  done
}
inList() {
  # space separated list
  local list="$1"
  # no space in search term
  local search="$2"
  # search is in middle of list (space-separated)
  [ -z "${list%%* "${search}" *}" ] \
    ||
    # search is last in list
    [ -z "${list%%* "${search}"}" ] \
    ||
    # search is first in list
    [ -z "${list##"${search}" *}" ] \
    &&
    # list is not empty - last due to left-assosiativity
    [ -n "${list}" ]
}
template() {
  readonly META=".template"
  readonly INSTALL="install.sh"
  local source="$1"
  local destination="$2"

  cp -r "${source}" "${destination}"
  if [ -f "${destination}/${META}/${INSTALL}" ]; then
    local curDir
    curDir="$(pwd)"
    cd "${destination}" || exit 1
    /usr/bin/env sh "${META}/${INSTALL}"
    cd "${curDir}" || exit 1
  fi
}

# Script
readonly REMOTE="${REMOTE:-"https://github.com/jaredthebean/templates"}"
# Args
if [ $# -lt 1 ]; then
  usage
  exit 1
fi
readonly LANG="$1"
readonly OPT="${2:-"base"}"

TEMP_DIR="$(mktemp -d)"
readonly TEMP_DIR
git clone --depth=1 "${REMOTE}" "${TEMP_DIR}"

LANGS="$(listDirs "${TEMP_DIR}")"
readonly LANGS

if ! inList "${LANGS}" "${LANG}"; then
  usage
  exit 1
fi

OPTS="$(listDirs "${TEMP_DIR}/${LANG}")"
readonly OPTS
if ! inList "${OPTS}" "${OPT}"; then
  usage "${LANG}"
  exit 1
fi

template "${TEMP_DIR}/${LANG}/${OPT}/." .

# Cleanup
rm -rf .template "${TEMP_DIR}"
