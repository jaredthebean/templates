#!/usr/bin/env sh

PY_LINT_TOOLS="ruff pre-commit"
if [ -f pyproject.toml ]; then
  uv init .
  uv venv
  uv sync
else
  echo "'pyproject.toml' present. Not initializing uv" >&2
fi
for tool in ${PY_LINT_TOOLS}; do
  uv tool install "${tool}"
done
uvx update-shell
${SHELL}
USER=$(whoami)
chown -R "${USER}:${USER}" .
pre-commit install
