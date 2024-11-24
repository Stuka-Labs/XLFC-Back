#!/bin/bash
export NODE_ENV=development
~/repos/XLFC-Back/functions/firebase-kill-ports.sh
echo "Ports killed..."
npm run build
firebase emulators:start --import ../data --export-on-exit ../data
