#!/usr/bin/env bash

set -e
yarn
yarn lint
yarn test:api
