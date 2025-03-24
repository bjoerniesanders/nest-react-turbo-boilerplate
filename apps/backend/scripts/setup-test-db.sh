#!/bin/bash

# Prüfe, ob PostgreSQL installiert ist
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL ist nicht installiert. Bitte installieren Sie PostgreSQL zuerst."
    exit 1
fi

# Datenbank-Parameter
DB_NAME="nest_react_turbo_template_test"
DB_USER="admin"
DB_PASSWORD="password"

# Create the user if it doesn't exist
psql postgres -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Erstelle die Datenbank, falls sie nicht existiert
psql postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Gewähre Berechtigungen
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Test-Datenbank wurde erfolgreich eingerichtet!" 