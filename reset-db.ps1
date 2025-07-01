# Set your database name and user
$DB_NAME = "tender-track-360"   # Your database name
$DB_USER = "postgres"           # Change if you use a different user

# 1. Delete all migration files and meta data
Write-Host "Deleting all migration files and meta data..."
Remove-Item -Recurse -Force .\supabase\migrations\*

# 2. Drop and recreate the database
Write-Host "Dropping and recreating the database..."
psql -U $DB_USER -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';"
psql -U $DB_USER -c "DROP DATABASE IF EXISTS `"$DB_NAME`";"
psql -U $DB_USER -c "CREATE DATABASE `"$DB_NAME`";"

# 3. Generate a new migration from your schema
Write-Host "Generating new migration from schema..."
pnpm drizzle-kit generate:pg

# 4. Apply the new migration
Write-Host "Applying new migration..."
pnpm db:migrate

Write-Host "Database and migrations have been reset!"
