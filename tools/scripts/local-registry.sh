#!/usr/bin/env bash

COMMAND=$1

if [[ $COMMAND == "enable" ]]; then
	echo "Enabling local registry..."

	npm config set registry http://localhost:4873/
	yarn config set registry http://localhost:4873/

	echo "  > NPM:  http://localhost:4873/"
	echo "  > YARN: http://localhost:4873/"

elif [[ $COMMAND == "disable" ]]; then
	echo "Disabling local registry..."

	npm config delete registry
	yarn config delete registry
	CURRENT_NPM_REGISTRY=$(npm config get registry)
	CURRENT_YARN_REGISTRY=$(yarn config get registry)

	echo "  > NPM:  $CURRENT_NPM_REGISTRY"
	echo "  > YARN: $CURRENT_YARN_REGISTRY"

elif [[ $COMMAND == "clear" ]]; then
	echo "Clearing local registry storage"

	rm -rf ./tmp/local-registry/storage

elif [[ $COMMAND == "start" ]]; then
	echo "Starting local registry..."

	VERDACCIO_HANDLE_KILL_SIGNALS=true
	yarn verdaccio --config ./.verdaccio/config.yml

elif [[ $COMMAND == "help" ]]; then
  echo "Usage: local-registry.sh [start|enable|disable|clear|help]"
  echo

	echo "start    Starts Verdaccio."
	echo "enable   Enables the local registry. Sets the NPM and Yarn registries to point to Verdaccio."
	echo "disable  Disables the local registry. Restores the NPM and Yarn registries."
	echo "clear    Clears the local registry storage."
	echo "help     Shows help."

elif [[ $COMMAND == "" ]]; then
  echo "No command specified."
  echo

  echo "Usage: local-registry.sh [start|enable|disable|clear|help]"

else
  echo "Unknown command: $COMMAND"
  echo

  echo "Usage: local-registry.sh [start|enable|disable|clear|help]"
fi
