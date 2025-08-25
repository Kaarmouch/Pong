/*import Database from "better-sqlite3";


const db = new Database("Pong_DB.db");

// Création de la table si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    balls_hit INTEGER DEFAULT 0,
    longest_rally INTEGER DEFAULT 0
  )
`).run();*/