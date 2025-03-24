#!/bin/bash

ENV_FILE="apps/backend/.env"
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from $ENV_FILE..."
  export $(grep -v '^#' $ENV_FILE | xargs)
else
  echo "Warning: No $ENV_FILE found. Using default values."
fi


DB_NAME="${DATABASE_NAME:-nest-react-turbo-template}"
SUPERUSER="${DATABASE_SUPERUSER:-$(whoami)}"
SUPERUSER_PASSWORD="${DATABASE_SUPERPASSWORD:-password}"

export PGPASSWORD="$SUPERUSER_PASSWORD"

echo "Checking if database '$DB_NAME' exists..."
RESULT=$(psql -U "$SUPERUSER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$RESULT" = "1" ]; then
  echo "Database already exists."
else
  echo "Database does not exist. Creating it now..."
  psql -U "$SUPERUSER" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"
fi

echo "Database setup complete."
