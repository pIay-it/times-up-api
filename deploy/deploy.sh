#!/usr/bin/env bash
git remote add deploy "ssh://$2@$3/$1"
git fetch --depth=1000000
git push deploy "$1"
