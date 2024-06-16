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
  CONSTRAINT pk_user_id PRIMARY KEY (id)
)"

psql $DB -c "CREATE TABLE IF NOT EXISTS notes_schema.notes(
  id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  finished BOOLEAN NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CONSTRAINT pk_note_id PRIMARY KEY (id),
  CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users_schema.users(id) ON UPDATE CASCADE ON DELETE CASCADE
)"

# Create Indexes
psql $DB -c "CREATE UNIQUE INDEX idx_users_id ON users_schema.users (id)"
psql $DB -c "CREATE UNIQUE INDEX idx_users_email ON users_schema.users (email)"

psql $DB -c "CLUSTER users_schema.users USING idx_users_id"

psql $DB -c "CREATE UNIQUE INDEX idx_notes_user_id_id ON notes_schema.notes (user_id, id)"
psql $DB -c "CREATE UNIQUE INDEX idx_notes_id ON notes_schema.notes (id)"

psql $DB -c "CLUSTER notes_schema.notes USING idx_notes_user_id_id"

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
