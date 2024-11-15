

#!/bin/bash

# Clean install dependencies
rm -rf node_modules
rm -rf package-lock.json

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Build the project
CI=false npm run build
