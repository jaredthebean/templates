#!/usr/bin/env sh

PY_LINT_TOOLS="ruff pre-commit"
if [ -f pyproject.toml ]; then
  echo "'pyproject.toml' present. Not initializing uv" >&2
else
  uv init .
  uv venv
  uv sync
fi
for tool in ${PY_LINT_TOOLS}; do
  uv tool install "${tool}"
done
output=$(uv tool update-shell 2>&1)
# If the uv tools bin PATH needed to be added
# then we get output with the word "update" in it
# brittle, but there isn't a different return code so ¯\_(ツ)_/¯
if [ -z "${output##Updated *}" ]; then
  ${SHELL}
fi
USER=$(whoami)
chown -R "${USER}:${USER}" .
pre-commit install
