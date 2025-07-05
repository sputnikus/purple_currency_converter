import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

import { ConverterData } from "./interface";

const DB_FILE = process.env.DATABASE_PATH || ":memory:";

var db_instance: null | Database<sqlite3.Database, sqlite3.Statement> = null;

export async function openDb() {
  if (db_instance !== null) {
    return db_instance;
  }
  if (DB_FILE == ":memory:") {
    console.log("Using in-memory SQLite instance.");
  }

  db_instance = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });
  return db_instance;
}

// Using single quotes to wrap SQL queries
// double quotes for tables and columns
export async function addRequest(request: ConverterData) {
  const db = await openDb();
  await db.run(
    'INSERT INTO "requests" ("from", "to", "amount") VALUES (?, ?, ?)',
    request.from,
    request.to,
    request.amount,
  );
}

export async function addResponse(value: number, currency: string) {
  const db = await openDb();
  await db.run(
    'INSERT INTO "responses" ("currency", "value") VALUES (?, ?)',
    currency,
    value,
  );
}

export async function getConversionCount() {
  const db = await openDb();
  return await db.get('SELECT COUNT(*) AS "sum" FROM "responses"');
}
