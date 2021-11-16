#!/usr/bin/env bash
git remote add deploy "ssh://$2@$3/$1"
git pull deploy staging
git push -u deploy "$1"
