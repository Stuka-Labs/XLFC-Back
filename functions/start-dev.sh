#!/bin/bash

# Set environment to development
export NODE_ENV=development

# Kill Firebase emulator ports
~/repos/XLFC-Back/functions/firebase-kill-ports.sh
echo "Ports killed..."

# Build xlfc-newcodebase project
echo "Building xlfc-newcodebase project..."
cd ../xlfc-newcodebase || { echo "xlfc-newcodebase not found!"; exit 1; }
npm run build || { echo "xlfc-newcodebase build failed!"; exit 1; }
echo "xlfc-newcodebase build completed."

# Return to the functions directory
cd ../functions || { echo "functions directory not found!"; exit 1; }

# Build Firebase functions
echo "Building Firebase functions..."
npm run build || { echo "Firebase functions build failed!"; exit 1; }
echo "Firebase functions build completed."

# Start Firebase emulators
firebase emulators:start --import ../data --export-on-exit ../data
