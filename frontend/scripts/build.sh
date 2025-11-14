#!/bin/bash
set -ex

pnpm wails:install

if [ ! -d "dist" ]; then
    next build
fi