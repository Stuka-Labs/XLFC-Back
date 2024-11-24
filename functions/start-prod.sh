#!/bin/bash
~/repos/XLFC-Back/functions/firebase-kill-ports.sh
export NODE_ENV=production
npm run build
firebase emulators:start --import ../data --export-on-exit ../data
