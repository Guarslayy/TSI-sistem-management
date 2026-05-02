const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { db, initSchema } = require('./db/database');
const { insert, list, remove, update } = require('./db/crud');
const { calculateIso27005Risk, getRiskLevel, calculateSLE, calculateALE } = require('./utils/risk');
const { buildReport } = require('./services/reportService');

initSchema();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json({ limit: '2mb' }));

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get('/api/organization', (req, res) => {
  res.json(db.prepare('SELECT * FROM organizations LIMIT 1').get());
});

app.put('/api/organization', (req, res) => {
  const fields = ['name', 'domain', 'employees', 'scope', 'description', 'technology_environment', 'business_processes', 'security_objectives'];
  const assignments = fields.map((field) => `${field} = ?`).join(', ');
  db.prepare(`UPDATE organizations SET ${assignments} WHERE id = ?`).run([...fields.map((field) => req.body[field]), req.body.id || 1]);
  res.json(db.prepare('SELECT * FROM organizations WHERE id = ?').get(req.body.id || 1));
});

const routes = [
  ['departments', '/api/departments'],
  ['assets', '/api/assets'],
  ['threats', '/api/threats'],
  ['risks', '/api/risks'],
  ['quantitative_risks', '/api/quantitative-risks'],
  ['controls', '/api/controls'],
  ['policies', '/api/policies']
];

routes.forEach(([table, route]) => {
  app.get(route, (req, res) => res.json(list(table)));
  if (table !== 'policies') {
    app.post(route, (req, res) => res.status(201).json(insert(table, enrich(table, req.body))));
    app.delete(`${route}/:id`, (req, res) => {
      remove(table, req.params.id);
      res.status(204).send();
    });
  }
  app.put(`${route}/:id`, (req, res) => res.json(update(table, req.params.id, enrich(table, req.body))));
});

function enrich(table, body) {
  const data = { ...body };
  if (table === 'risks') {
    data.risk_score = calculateIso27005Risk(Number(data.tp), Number(data.vl), Number(data.sev), Number(data.det));
    data.risk_level = getRiskLevel(data.risk_score);
  }
  if (table === 'quantitative_risks') {
    data.sle = calculateSLE(Number(data.asset_value), Number(data.exposure_factor));
    data.ale = calculateALE(data.sle, Number(data.aro));
  }
  return data;
}

app.get('/api/checklist/iso27001', (req, res) => {
  const questions = db.prepare('SELECT * FROM checklist_questions WHERE standard = ? ORDER BY order_number').all('ISO 27001');
  const answers = db.prepare('SELECT * FROM checklist_answers').all();
  res.json({ questions, answers });
});

app.post('/api/checklist/iso27001/answers', (req, res) => {
  const insertAnswer = db.prepare('INSERT INTO checklist_answers (question_id, answer) VALUES (?, ?)');
  const deleteExisting = db.prepare('DELETE FROM checklist_answers WHERE question_id = ?');
  db.transaction((answers) => {
    answers.forEach((answer) => {
      deleteExisting.run(answer.question_id);
      insertAnswer.run(answer.question_id, answer.answer);
    });
  })(req.body.answers || []);
  res.status(201).json({ ok: true });
});

app.delete('/api/checklist/iso27001/answers', (req, res) => {
  db.prepare('DELETE FROM checklist_answers').run();
  res.status(204).send();
});

app.get('/api/report', (req, res) => {
  const markdown = buildReport();
  const reportPath = path.join(__dirname, '..', '..', 'reports', 'final-report.md');
  fs.writeFileSync(reportPath, markdown, 'utf8');
  res.json({ markdown, path: reportPath });
});

app.get('/api/export/assets.csv', (req, res) => csv(res, 'assets', list('assets')));
app.get('/api/export/risks.csv', (req, res) => csv(res, 'risks', list('risks')));

function csv(res, name, rows) {
  const headers = Object.keys(rows[0] || {});
  const content = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${name}.csv"`);
  res.send(content);
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`ISO CyberSecurity API is running on http://localhost:${port}`);
});
