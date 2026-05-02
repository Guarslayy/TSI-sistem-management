const { db } = require('./database');

const allowedTables = {
  departments: ['organization_id', 'name', 'description'],
  assets: ['name', 'category', 'owner_department', 'confidentiality_level', 'integrity_level', 'availability_level', 'business_value', 'description'],
  threats: ['asset_id', 'vulnerability', 'threat', 'consequence', 'mitigation'],
  risks: ['asset_id', 'vulnerability', 'threat', 'description', 'tp', 'vl', 'sev', 'det', 'risk_score', 'risk_level', 'recommended_control', 'residual_risk', 'priority', 'control_type', 'control_function', 'implementation_steps'],
  quantitative_risks: ['asset_name', 'threat', 'asset_value', 'exposure_factor', 'sle', 'aro', 'ale', 'recommendation'],
  controls: ['name', 'control_type', 'control_function', 'description', 'implementation_status', 'responsible_department', 'related_risks'],
  policies: ['title', 'purpose', 'scope', 'roles', 'policy_statements', 'procedure', 'monitoring', 'review_frequency']
};

function list(table) {
  return db.prepare(`SELECT * FROM ${table} ORDER BY id`).all();
}

function insert(table, body) {
  const fields = allowedTables[table].filter((field) => Object.prototype.hasOwnProperty.call(body, field));
  const placeholders = fields.map(() => '?').join(', ');
  const statement = db.prepare(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`);
  const result = statement.run(fields.map((field) => body[field]));
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
}

function update(table, id, body) {
  const fields = allowedTables[table].filter((field) => Object.prototype.hasOwnProperty.call(body, field));
  if (!fields.length) return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  db.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`).run([...fields.map((field) => body[field]), id]);
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

function remove(table, id) {
  return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

module.exports = { allowedTables, list, insert, update, remove };
