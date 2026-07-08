#!/bin/bash
set -e

BACKEND_DIR="$HOME/Documentos/dev/secrets/voluntarios-back"
FRONTEND_DIR="$HOME/Documentos/dev/secrets/voluntarios-front"

mkdir -p "$BACKEND_DIR" "$FRONTEND_DIR"

# Backup backend envs
for f in voluntarios-back/.env*; do
  [ -f "$f" ] && cp "$f" "$BACKEND_DIR/"
done

# Backup frontend envs
for f in voluntarios-front/.env*; do
  [ -f "$f" ] && cp "$f" "$FRONTEND_DIR/"
done

echo "Env files backed up to secrets directories"