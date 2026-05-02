import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { deleteItem, getList, saveItem } from '../api/client';
import CrudModal, { Field } from '../components/CrudModal';
import PageHeader from '../components/PageHeader';
import { Asset, Threat } from '../types';

export default function Threats() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetFilter, setAssetFilter] = useState('');
  const [riskType, setRiskType] = useState('');
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState<Partial<Threat>>({});
  const assetName = (id: number) => assets.find((asset) => asset.id === id)?.name || String(id);
  const load = () => Promise.all([getList<Threat>('/threats'), getList<Asset>('/assets')]).then(([t, a]) => { setThreats(t); setAssets(a); });
  useEffect(() => { load(); }, []);

  const fields: Field[] = [
    { key: 'asset_id', label: 'Актив', type: 'select', options: assets.map((asset) => String(asset.id)) },
    { key: 'vulnerability', label: 'Уязвимость', type: 'textarea' },
    { key: 'threat', label: 'Угроза', type: 'textarea' },
    { key: 'consequence', label: 'Возможное последствие', type: 'textarea' },
    { key: 'mitigation', label: 'Меры снижения риска', type: 'textarea' }
  ];

  const filtered = useMemo(() => threats
    .filter((threat) => !assetFilter || String(threat.asset_id) === assetFilter)
    .filter((threat) => !riskType || `${threat.vulnerability} ${threat.threat}`.toLowerCase().includes(riskType.toLowerCase())), [threats, assetFilter, riskType]);

  const save = async () => {
    await saveItem<Threat>('/threats', draft);
    setModal(false);
    setDraft({});
    load();
  };

  return (
    <>
      <PageHeader title="Анализ угроз и уязвимостей" />
      <Card className="academic-card mb-3"><Card.Body className="row g-3">
        <Form.Group className="col-md-5"><Form.Label>Filter by asset</Form.Label><Form.Select value={assetFilter} onChange={(e) => setAssetFilter(e.target.value)}><option value="">All</option>{assets.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</Form.Select></Form.Group>
        <Form.Group className="col-md-5"><Form.Label>Filter by risk type</Form.Label><Form.Control value={riskType} onChange={(e) => setRiskType(e.target.value)} placeholder="phishing, ransomware, access..." /></Form.Group>
        <div className="col-md-2 d-flex align-items-end"><Button className="w-100" variant="dark" onClick={() => { setDraft({}); setModal(true); }}>Create</Button></div>
      </Card.Body></Card>
      <div className="table-responsive">
        <Table bordered hover size="sm">
          <thead><tr><th>ID</th><th>Актив</th><th>Уязвимость</th><th>Угроза</th><th>Возможное последствие</th><th>Меры снижения риска</th><th>Действия</th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={row.id}><td>{row.id}</td><td>{assetName(row.asset_id)}</td><td>{row.vulnerability}</td><td>{row.threat}</td><td>{row.consequence}</td><td>{row.mitigation}</td><td className="text-nowrap"><Button size="sm" variant="outline-dark" onClick={() => { setDraft(row); setModal(true); }}>Edit</Button>{' '}<Button size="sm" variant="outline-danger" onClick={() => deleteItem('/threats', row.id).then(load)}>Delete</Button></td></tr>)}</tbody>
        </Table>
      </div>
      <CrudModal title="Threat" show={modal} item={draft} fields={fields} onChange={(key, value) => setDraft((d) => ({ ...d, [key]: key === 'asset_id' ? Number(value) : value }))} onClose={() => setModal(false)} onSave={save} />
    </>
  );
}
