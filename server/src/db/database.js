const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', '..', '..', 'database', 'isms.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT,
      employees INTEGER,
      scope TEXT,
      description TEXT,
      technology_environment TEXT,
      business_processes TEXT,
      security_objectives TEXT
    );
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      name TEXT NOT NULL,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      owner_department TEXT,
      confidentiality_level TEXT,
      integrity_level TEXT,
      availability_level TEXT,
      business_value TEXT,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS threats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER,
      vulnerability TEXT,
      threat TEXT,
      consequence TEXT,
      mitigation TEXT
    );
    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER,
      vulnerability TEXT,
      threat TEXT,
      description TEXT,
      tp INTEGER,
      vl INTEGER,
      sev INTEGER,
      det INTEGER,
      risk_score INTEGER,
      risk_level TEXT,
      recommended_control TEXT,
      residual_risk TEXT,
      priority TEXT,
      control_type TEXT,
      control_function TEXT,
      implementation_steps TEXT
    );
    CREATE TABLE IF NOT EXISTS quantitative_risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_name TEXT,
      threat TEXT,
      asset_value REAL,
      exposure_factor REAL,
      sle REAL,
      aro REAL,
      ale REAL,
      recommendation TEXT
    );
    CREATE TABLE IF NOT EXISTS controls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      control_type TEXT,
      control_function TEXT,
      description TEXT,
      implementation_status TEXT,
      responsible_department TEXT,
      related_risks TEXT
    );
    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      purpose TEXT,
      scope TEXT,
      roles TEXT,
      policy_statements TEXT,
      procedure TEXT,
      monitoring TEXT,
      review_frequency TEXT
    );
    CREATE TABLE IF NOT EXISTS checklist_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      standard TEXT,
      section TEXT,
      question TEXT,
      order_number INTEGER
    );
    CREATE TABLE IF NOT EXISTS checklist_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      answer TEXT
    );
  `);
}

module.exports = { db, initSchema };
