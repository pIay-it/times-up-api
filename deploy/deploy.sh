#!/usr/bin/env bash
git fetch --all
git checkout "$1"
git pull origin "$1"
git remote add deploy "ssh://$2@$3/$1"
git push deploy "$1"
