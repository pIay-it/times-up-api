#!/usr/bin/env bash
git remote add deploy "ssh://$2@$3/$1"
git checkout "$1"
git push -u deploy "$1"
