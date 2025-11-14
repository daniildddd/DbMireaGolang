#!/bin/bash
set -ex

pnpm wails:install
next dev -p 3030 --turbopack