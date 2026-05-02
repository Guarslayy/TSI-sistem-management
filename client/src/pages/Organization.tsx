import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import { Organization as OrgType } from '../types';

export default function Organization() {
  const [org, setOrg] = useState<OrgType | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<OrgType>('/organization').then(({ data }) => setOrg(data));
  }, []);

  const update = (key: keyof OrgType, value: string | number) => setOrg((current) => current ? { ...current, [key]: value } : current);
  const save = async () => {
    if (!org) return;
    const { data } = await api.put<OrgType>('/organization', org);
    setOrg(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (!org) return <p>Loading...</p>;

  return (
    <>
      <PageHeader title="Описание организации" />
      {saved && <Alert variant="success">Saved</Alert>}
      <Card className="academic-card">
        <Card.Body>
          <Form className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>название организации</Form.Label>
              <Form.Control value={org.name} onChange={(event) => update('name', event.target.value)} />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>сфера деятельности</Form.Label>
              <Form.Control value={org.domain} onChange={(event) => update('domain', event.target.value)} />
            </Form.Group>
            <Form.Group className="col-md-2">
              <Form.Label>количество сотрудников</Form.Label>
              <Form.Control type="number" value={org.employees} onChange={(event) => update('employees', Number(event.target.value))} />
            </Form.Group>
            <Form.Group className="col-12">
              <Form.Label>критические бизнес-процессы</Form.Label>
              <Form.Control as="textarea" rows={3} value={org.business_processes} onChange={(event) => update('business_processes', event.target.value)} />
            </Form.Group>
            <Form.Group className="col-12">
              <Form.Label>технологическая среда</Form.Label>
              <Form.Control as="textarea" rows={3} value={org.technology_environment} onChange={(event) => update('technology_environment', event.target.value)} />
            </Form.Group>
            <Form.Group className="col-12">
              <Form.Label>область применения ISMS</Form.Label>
              <Form.Control as="textarea" rows={4} value={org.scope} onChange={(event) => update('scope', event.target.value)} />
            </Form.Group>
            <Form.Group className="col-12">
              <Form.Label>цели безопасности</Form.Label>
              <Form.Control as="textarea" rows={2} value={org.security_objectives} onChange={(event) => update('security_objectives', event.target.value)} />
            </Form.Group>
          </Form>
          <Button className="mt-3" variant="dark" onClick={save}>Сохранить</Button>
        </Card.Body>
      </Card>
    </>
  );
}
