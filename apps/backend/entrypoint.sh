#!/bin/sh
echo "Running database setup..."

npm run mikro-orm schema:create

echo "Starting application..."
exec npm run start
