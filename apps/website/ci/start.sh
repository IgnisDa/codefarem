#!/usr/bin/env sh

set -o errexit
set -o nounset

ls -lahR
npx remix-serve ./index.js
