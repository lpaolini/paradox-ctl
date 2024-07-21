#!/bin/sh

if [ "$DEV" ]; then
    npm run dev
else
    npm run start
fi
