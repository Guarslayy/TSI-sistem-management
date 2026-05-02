import { useEffect, useState } from 'react';
import { Button, Card, Form, Nav, Tab } from 'react-bootstrap';
import { getList, saveItem } from '../api/client';
import PageHeader from '../components/PageHeader';
import { Policy } from '../types';

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const load = () => getList<Policy>('/policies').then(setPolicies);
  useEffect(() => { load(); }, []);

  const update = (id: number, key: keyof Policy, value: string) => setPolicies((current) => current.map((policy) => policy.id === id ? { ...policy, [key]: value } : policy));
  const save = async (policy: Policy) => {
    await saveItem<Policy>('/policies', policy);
    setEditing(null);
    load();
  };
  const exportMarkdown = (policy: Policy) => {
    const md = `# ${policy.title}\n\n## Цель\n${policy.purpose}\n\n## Область применения\n${policy.scope}\n\n## Роли и ответственность\n${policy.roles}\n\n## Требования политики\n${policy.policy_statements}\n\n## Процедура выполнения\n${policy.procedure}\n\n## Мониторинг соблюдения\n${policy.monitoring}\n\n## Периодичность пересмотра\n${policy.review_frequency}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policy.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title="Политики информационной безопасности" />
      <Tab.Container defaultActiveKey="1">
        <Nav variant="tabs" className="mb-3">{policies.map((policy) => <Nav.Item key={policy.id}><Nav.Link eventKey={String(policy.id)}>{policy.title}</Nav.Link></Nav.Item>)}</Nav>
        <Tab.Content>{policies.map((policy) => <Tab.Pane eventKey={String(policy.id)} key={policy.id}>
          <Card className="academic-card"><Card.Body>
            {editing === policy.id ? (
              <Form className="row g-3">
                {(['purpose', 'scope', 'roles', 'policy_statements', 'procedure', 'monitoring', 'review_frequency'] as const).map((key) => (
                  <Form.Group className="col-12" key={key}><Form.Label>{key}</Form.Label><Form.Control as="textarea" rows={key === 'review_frequency' ? 1 : 3} value={policy[key]} onChange={(e) => update(policy.id, key, e.target.value)} /></Form.Group>
                ))}
              </Form>
            ) : (
              <dl>
                <dt>Цель</dt><dd>{policy.purpose}</dd><dt>Область применения</dt><dd>{policy.scope}</dd><dt>Роли и ответственность</dt><dd>{policy.roles}</dd><dt>Требования политики</dt><dd>{policy.policy_statements}</dd><dt>Процедура выполнения</dt><dd>{policy.procedure}</dd><dt>Мониторинг соблюдения</dt><dd>{policy.monitoring}</dd><dt>Периодичность пересмотра</dt><dd>{policy.review_frequency}</dd>
              </dl>
            )}
            <Button variant="dark" onClick={() => editing === policy.id ? save(policy) : setEditing(policy.id)}>{editing === policy.id ? 'Save' : 'Edit'}</Button>{' '}
            <Button variant="outline-dark" onClick={() => exportMarkdown(policy)}>Export Markdown</Button>
          </Card.Body></Card>
        </Tab.Pane>)}</Tab.Content>
      </Tab.Container>
    </>
  );
}
