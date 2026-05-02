import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Form, Table } from 'react-bootstrap';
import { getList } from '../api/client';
import PageHeader from '../components/PageHeader';
import { Control } from '../types';

const types = ['Физические контроли', 'Технические контроли', 'Административные контроли'];
const functions = ['Предупреждающие', 'Обнаруживающие', 'Корректирующие'];
const statuses = ['Не внедрено', 'Запланировано', 'Внедрено'];

export default function Controls() {
  const [controls, setControls] = useState<Control[]>([]);
  const [type, setType] = useState('');
  const [fn, setFn] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => { getList<Control>('/controls').then(setControls); }, []);
  const filtered = useMemo(() => controls
    .filter((c) => !type || c.control_type === type)
    .filter((c) => !fn || c.control_function === fn)
    .filter((c) => !status || c.implementation_status === status), [controls, type, fn, status]);

  const statusVariant = (value: string) => value === 'Внедрено' ? 'success' : value === 'Запланировано' ? 'warning' : 'secondary';

  return (
    <>
      <PageHeader title="Контроли информационной безопасности" />
      <Card className="academic-card mb-3"><Card.Body className="row g-3">
        <Form.Group className="col-md-4"><Form.Label>Type</Form.Label><Form.Select value={type} onChange={(e) => setType(e.target.value)}><option value="">All</option>{types.map((item) => <option key={item}>{item}</option>)}</Form.Select></Form.Group>
        <Form.Group className="col-md-4"><Form.Label>Function</Form.Label><Form.Select value={fn} onChange={(e) => setFn(e.target.value)}><option value="">All</option>{functions.map((item) => <option key={item}>{item}</option>)}</Form.Select></Form.Group>
        <Form.Group className="col-md-4"><Form.Label>Status</Form.Label><Form.Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</Form.Select></Form.Group>
      </Card.Body></Card>
      <div className="table-responsive">
        <Table bordered hover>
          <thead><tr><th>Type / Function</th>{functions.map((item) => <th key={item}>{item}</th>)}</tr></thead>
          <tbody>{types.map((typeName) => <tr key={typeName}><th>{typeName}</th>{functions.map((functionName) => <td key={functionName}>{filtered.filter((c) => c.control_type === typeName && c.control_function === functionName).map((control) => <Card className="academic-card mb-2" key={control.id}><Card.Body className="p-2"><strong>{control.name}</strong><p className="small mb-1">{control.description}</p><Badge bg={statusVariant(control.implementation_status)} text={control.implementation_status === 'Запланировано' ? 'dark' : undefined}>{control.implementation_status}</Badge><div className="small text-muted mt-1">{control.responsible_department}</div></Card.Body></Card>)}</td>)}</tr>)}</tbody>
        </Table>
      </div>
    </>
  );
}
