import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { getList, saveItem } from '../api/client';
import PageHeader from '../components/PageHeader';
import { calculateALE, calculateSLE } from '../utils/risk';
import { QuantitativeRisk as QRisk } from '../types';

export default function QuantitativeRisk() {
  const [rows, setRows] = useState<QRisk[]>([]);
  const load = () => getList<QRisk>('/quantitative-risks').then(setRows);
  useEffect(() => { load(); }, []);
  const total = useMemo(() => rows.reduce((sum, row) => sum + Number(row.ale), 0), [rows]);

  const update = async (row: QRisk, key: keyof QRisk, value: string | number) => {
    const next = { ...row, [key]: value };
    next.sle = calculateSLE(Number(next.asset_value), Number(next.exposure_factor));
    next.ale = calculateALE(next.sle, Number(next.aro));
    setRows((current) => current.map((item) => item.id === row.id ? next : item));
    await saveItem<QRisk>('/quantitative-risks', next);
  };

  return (
    <>
      <PageHeader title="Количественная оценка рисков" />
      <Card className="academic-card mb-3"><Card.Body><strong>SLE = Asset Value × Exposure Factor</strong><br /><strong>ALE = SLE × ARO</strong><p className="mb-0 mt-2">Total ALE: {total.toLocaleString()} EUR</p></Card.Body></Card>
      <div className="table-responsive">
        <Table bordered hover size="sm">
          <thead><tr><th>Название актива</th><th>Угроза</th><th>Стоимость актива</th><th>Exposure Factor</th><th>SLE</th><th>ARO</th><th>ALE</th><th>Рекомендация</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.id}>
            <td><Form.Control size="sm" value={row.asset_name} onChange={(e) => update(row, 'asset_name', e.target.value)} /></td>
            <td><Form.Control size="sm" value={row.threat} onChange={(e) => update(row, 'threat', e.target.value)} /></td>
            <td><Form.Control size="sm" type="number" value={row.asset_value} onChange={(e) => update(row, 'asset_value', Number(e.target.value))} /></td>
            <td><Form.Control size="sm" type="number" step="0.01" value={row.exposure_factor} onChange={(e) => update(row, 'exposure_factor', Number(e.target.value))} /></td>
            <td>{Number(row.sle).toLocaleString()} EUR</td>
            <td><Form.Control size="sm" type="number" step="0.01" value={row.aro} onChange={(e) => update(row, 'aro', Number(e.target.value))} /></td>
            <td>{Number(row.ale).toLocaleString()} EUR</td>
            <td><Form.Control size="sm" as="textarea" value={row.recommendation} onChange={(e) => update(row, 'recommendation', e.target.value)} /></td>
          </tr>)}</tbody>
        </Table>
      </div>
      <Button variant="outline-dark" onClick={load}>Refresh</Button>
    </>
  );
}
