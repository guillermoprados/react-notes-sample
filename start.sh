#!/bin/sh

set -e

# Backend env setup
if [ ! -f ./backend/.env ]; then
  cp ./backend/.env_template ./backend/.env
  echo "Created backend/.env from template."
fi

# Frontend env setup
if [ ! -f ./frontend/.env ]; then
  cp ./frontend/.env_template ./frontend/.env
  echo "Created frontend/.env from template."
fi

docker compose up --build
