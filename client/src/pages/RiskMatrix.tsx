import { useState } from 'react';
import { Badge, Card, Form, Table } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import { calculateQualitativeRisk } from '../utils/risk';

const probabilities = ['Редко', 'Маловероятно', 'Возможно', 'Вероятно', 'Почти неизбежно'];
const impacts = ['Очень низкое', 'Низкое', 'Среднее', 'Высокое', 'Очень высокое'];

export default function RiskMatrix() {
  const [probability, setProbability] = useState(3);
  const [impact, setImpact] = useState(3);
  const result = calculateQualitativeRisk(probability, impact);

  return (
    <>
      <PageHeader title="Качественная матрица рисков" />
      <Card className="academic-card mb-3"><Card.Body className="row g-3 align-items-end">
        <Form.Group className="col-md-5"><Form.Label>Probability</Form.Label><Form.Select value={probability} onChange={(e) => setProbability(Number(e.target.value))}>{probabilities.map((p, i) => <option value={i + 1} key={p}>{p}</option>)}</Form.Select></Form.Group>
        <Form.Group className="col-md-5"><Form.Label>Impact</Form.Label><Form.Select value={impact} onChange={(e) => setImpact(Number(e.target.value))}>{impacts.map((p, i) => <option value={i + 1} key={p}>{p}</option>)}</Form.Select></Form.Group>
        <div className="col-md-2"><Badge bg={result.color === 'orange' ? 'warning' : result.color} text={result.color === 'warning' || result.color === 'orange' ? 'dark' : undefined} className="fs-6 w-100">{result.level}</Badge></div>
      </Card.Body></Card>
      <div className="table-responsive">
        <Table bordered>
          <tbody>
            <tr><th>Impact / Probability</th>{probabilities.map((p) => <th key={p}>{p}</th>)}</tr>
            {impacts.map((impactLabel, i) => <tr key={impactLabel}><th>{impactLabel}</th>{probabilities.map((_, p) => {
              const cell = calculateQualitativeRisk(p + 1, i + 1);
              return <td key={p} className={`matrix-cell table-${cell.color === 'orange' ? 'warning' : cell.color}`}>{cell.level}</td>;
            })}</tr>)}
          </tbody>
        </Table>
      </div>
    </>
  );
}
