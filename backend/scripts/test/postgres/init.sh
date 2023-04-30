#!/bin/bash

set -e

# Create Databases
psql $POSTGRES_DB -c "CREATE DATABASE $DB WITH ENCODING 'UTF8' TEMPLATE template1"

# Create Users
psql $POSTGRES_DB -c "CREATE USER $USER WITH PASSWORD '$PASSWORD' VALID UNTIL '2030-01-01' CONNECTION LIMIT $MAX_CONNECTIONS"

# Create Schemas
psql $DB -c "CREATE SCHEMA IF NOT EXISTS users_schema AUTHORIZATION $USER"
psql $DB -c "CREATE SCHEMA IF NOT EXISTS notes_schema AUTHORIZATION $USER"

psql $DB -c "CREATE TABLE IF NOT EXISTS users_schema.users(
  id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  PRIMARY KEY (id)
)"

psql $DB -c "CREATE TABLE IF NOT EXISTS notes_schema.notes(
  id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  finished BOOLEAN NOT NULL,
  userId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_id FOREIGN KEY(userId) REFERENCES users_schema.users(id) ON UPDATE CASCADE ON DELETE CASCADE
)"

# Grant Privileges
psql $POSTGRES_DB -c "GRANT CONNECT ON DATABASE $DB TO $USER"

psql $DB -c "GRANT USAGE ON SCHEMA users_schema TO $USER"
psql $DB -c "GRANT USAGE ON SCHEMA notes_schema TO $USER"

psql $DB -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA users_schema TO $USER"
psql $DB -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA notes_schema TO $USER"

# Alter Data
psql $POSTGRES_DB -c "ALTER DATABASE $DB OWNER TO $USER"

psql $DB -c "ALTER SCHEMA users_schema OWNER TO $USER"
psql $DB -c "ALTER SCHEMA notes_schema OWNER TO $USER"

psql $DB -c "ALTER TABLE users_schema.users OWNER TO $USER"
psql $DB -c "ALTER TABLE notes_schema.notes OWNER TO $USER"