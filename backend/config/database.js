const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../database/learning.db");

class DB {
  constructor() {
    this.db = null;
  }

  initialize() {
    try {
      this.db = new Database(DB_PATH);
      console.log("✅ Database connected");

      this.createTables();
    } catch (err) {
      console.error("❌ Database connection failed:", err);
      process.exit(1);
    }
  }

  createTables() {
    const tables = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'parent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER,
        name TEXT NOT NULL,
        age INTEGER,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(parent_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        module TEXT NOT NULL,
        user_input TEXT,
        ai_response TEXT,
        score INTEGER,
        feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(child_id) REFERENCES children(id)
      );

      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        module TEXT NOT NULL,
        total_attempts INTEGER DEFAULT 0,
        average_score REAL DEFAULT 0,
        last_practiced DATETIME,
        mastery_level REAL DEFAULT 0,
        FOREIGN KEY(child_id) REFERENCES children(id)
      );
    `;

    try {
      this.db.exec(tables);
      console.log("✅ Database tables ready");
    } catch (err) {
      console.error("❌ Error creating tables:", err);
    }
  }

  saveActivity(activity) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO activities (
          child_id, module, user_input, ai_response, score, feedback
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        activity.childId,
        activity.module,
        activity.userInput,
        activity.aiResponse,
        activity.score,
        activity.feedback
      );

      return { id: result.lastInsertRowid };
    } catch (err) {
      throw err;
    }
  }

  getProgress(childId, module = null) {
    try {
      let query = "SELECT * FROM progress WHERE child_id = ?";
      const params = [childId];

      if (module) {
        query += " AND module = ?";
        params.push(module);
      }

      return this.db.prepare(query).all(...params);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DB();
