#!/bin/sh
echo "Running database migrations..."
npx npx prisma generate

echo "Starting the URL service..."
exec node dist/main