#!/usr/bin/env sh

set -e

# Build everything again in order to get optimized pages with the correct configuration settings.
npm run clean
npm run build

# Start the server
npm start
