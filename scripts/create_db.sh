#!/usr/bin/env bash

read -p "This will delete any existing data. Do you want to continue? (y)Yes/(n)No: " choice

case "$choice" in
  [yY]* ) echo "Creating database..." ;;
  [nN]* ) echo "Goodbye."; exit 0 ;;
  * ) echo "Invalid Choice."; exit 1 ;;
esac

# Run sqlite3 with SQL commands to create tables
sqlite3 "$1" <<EOF
DROP TABLE IF EXISTS "requests";
DROP TABLE IF EXISTS "responses";

CREATE TABLE "requests" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "from_currency" TEXT NOT NULL,
    "to_currency" TEXT NOT NULL,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "responses" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP
);
EOF
