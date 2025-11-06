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
uvx update-shell > /dev/null 2>&1
${SHELL}
USER=$(whoami)
chown -R "${USER}:${USER}" .
pre-commit install
