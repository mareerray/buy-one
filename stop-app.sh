#!/usr/bin/env bash
set -e

# Ports used by your services
PORTS="8761 8080 8456 8567 8678 4200"

for p in $PORTS; do
  pid=$(lsof -ti :$p || true)
  if [ -n "$pid" ]; then
    echo "Killing PID $pid on port $p"
    kill "$pid" || true
  fi
done
