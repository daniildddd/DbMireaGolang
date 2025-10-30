#!/bin/bash
set -ex

if [ ! -d "node_modules" ]; then
    pnpm install --frozen-lockfile
fi

if [ ! -d "dist" ]; then
    next build
fi