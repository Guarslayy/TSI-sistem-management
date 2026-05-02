import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { deleteItem, getList, saveItem } from '../api/client';
import CrudModal, { Field } from '../components/CrudModal';
import PageHeader from '../components/PageHeader';
import { Asset } from '../types';

const categories = ['Информация / данные', 'Программное обеспечение', 'Аппаратное обеспечение', 'Сеть'];
const levels = ['Низкий', 'Средний', 'Высокий', 'Критический'];
const fields: Field[] = [
  { key: 'name', label: 'Название актива' },
  { key: 'category', label: 'Категория', type: 'select', options: categories },
  { key: 'owner_department', label: 'Владелец / отдел' },
  { key: 'confidentiality_level', label: 'Конфиденциальность', type: 'select', options: levels },
  { key: 'integrity_level', label: 'Целостность', type: 'select', options: levels },
  { key: 'availability_level', label: 'Доступность', type: 'select', options: levels },
  { key: 'business_value', label: 'Бизнес-ценность', type: 'select', options: levels },
  { key: 'description', label: 'Описание', type: 'textarea' }
];

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState<Partial<Asset>>({});

  const load = () => getList<Asset>('/assets').then(setAssets);
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => assets
    .filter((asset) => !category || asset.category === category)
    .filter((asset) => `${asset.name} ${asset.description}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => levels.indexOf(b.business_value) - levels.indexOf(a.business_value)), [assets, category, query]);

  const save = async () => {
    await saveItem<Asset>('/assets', draft);
    setModal(false);
    setDraft({});
    load();
  };

  return (
    <>
      <PageHeader title="Реестр информационных активов" />
      <Card className="academic-card mb-3"><Card.Body className="row g-3">
        <Form.Group className="col-md-6"><Form.Label>Search</Form.Label><Form.Control value={query} onChange={(e) => setQuery(e.target.value)} /></Form.Group>
        <Form.Group className="col-md-4"><Form.Label>Filter by category</Form.Label><Form.Select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All</option>{categories.map((c) => <option key={c}>{c}</option>)}</Form.Select></Form.Group>
        <div className="col-md-2 d-flex align-items-end"><Button className="w-100" variant="dark" onClick={() => { setDraft({}); setModal(true); }}>Create</Button></div>
      </Card.Body></Card>
      <div className="table-responsive">
        <Table bordered hover size="sm">
          <thead><tr><th>ID</th><th>Название актива</th><th>Категория</th><th>Владелец / отдел</th><th>Конфиденциальность</th><th>Целостность</th><th>Доступность</th><th>Бизнес-ценность</th><th>Описание</th><th>Действия</th></tr></thead>
          <tbody>{filtered.map((asset) => <tr key={asset.id}><td>{asset.id}</td><td>{asset.name}</td><td>{asset.category}</td><td>{asset.owner_department}</td><td>{asset.confidentiality_level}</td><td>{asset.integrity_level}</td><td>{asset.availability_level}</td><td>{asset.business_value}</td><td>{asset.description}</td><td className="text-nowrap"><Button size="sm" variant="outline-dark" onClick={() => { setDraft(asset); setModal(true); }}>Edit</Button>{' '}<Button size="sm" variant="outline-danger" onClick={() => deleteItem('/assets', asset.id).then(load)}>Delete</Button></td></tr>)}</tbody>
        </Table>
      </div>
      <CrudModal title="Asset" show={modal} item={draft} fields={fields} onChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))} onClose={() => setModal(false)} onSave={save} />
    </>
  );
}
