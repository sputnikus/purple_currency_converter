import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

import { ConversionStats, ConverterData } from "./interface";

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

export async function addRequest(request: ConverterData) {
  const db = await openDb();
  await db.run(
    "INSERT INTO requests (from_currency, to_currency, amount) VALUES (?, ?, ?)",
    request.from,
    request.to,
    request.amount,
  );
}

export async function addResponse(value: number, currency: string) {
  const db = await openDb();
  await db.run(
    "INSERT INTO responses (currency, value) VALUES (?, ?)",
    currency,
    value,
  );
}

export async function getConversionStats(
  currency: string,
): Promise<ConversionStats> {
  const db = await openDb();
  const [total, totalCurrency, dailyCurrency] = await Promise.all([
    db.get("SELECT COUNT(*) AS count FROM responses"),
    db.get(
      "SELECT SUM(value) AS sum FROM responses WHERE currency = ?",
      currency,
    ),
    db.get(
      `SELECT COUNT(*) AS count, SUM(value) AS sum
      FROM responses
      WHERE currency = ? AND date(created_at) = date('now')`,
      currency,
    ),
  ]);
  return {
    total: {
      count: total.count as number,
    },
    totalCurrency: {
      sum: ((totalCurrency.sum || 0) as number).toFixed(2),
    },
    dailyCurrency: {
      count: dailyCurrency.count as number,
      sum: ((dailyCurrency.sum || 0) as number).toFixed(2),
    },
  };
}
