#!/usr/bin/env bash
git remote add deploy "ssh://$2@$3/$1"
git fetch --unshallow origin
git push deploy "$1"