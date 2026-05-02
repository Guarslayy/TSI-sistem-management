import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import { ChecklistQuestion } from '../types';

export default function Iso27001Result() {
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([]);
  const answers = useMemo(() => JSON.parse(localStorage.getItem('iso27001Answers') || '{}') as Record<string, string>, []);
  useEffect(() => { api.get('/checklist/iso27001').then(({ data }) => setQuestions(data.questions)); }, []);
  const yes = Object.values(answers).filter((answer) => answer === 'Да').length;
  const no = questions.length ? questions.length - yes : 0;
  const percent = questions.length ? Math.round((yes / questions.length) * 100) : 0;
  const result = percent >= 75 ? 'Компания условно проходит checklist ISO 27001' : percent >= 50 ? 'Компания нуждается в улучшении' : 'Компания не проходит checklist ISO 27001';
  const data = [{ name: 'Да %', value: yes }, { name: 'Нет %', value: no }];

  const exportReport = () => {
    const text = `# ISO 27001 Checklist\n\nКомпания: MediNova Clinic SRL\n\nВыполнено: ${yes}\n\nТребует внедрения: ${no}\n\nВсего вопросов: ${questions.length}\n\nПроцент выполнения: ${percent}%\n\nРезультат: ${result}`;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iso27001-checklist-report.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title="ISO 27001 Result" />
      <div className="row g-3">
        <div className="col-md-5"><Card className="academic-card h-100"><Card.Body>
          <Table bordered><tbody><tr><th>Компания</th><td>MediNova Clinic SRL</td></tr><tr><th>Выполнено</th><td>{yes}</td></tr><tr><th>Требует внедрения</th><td>{no}</td></tr><tr><th>Всего вопросов</th><td>{questions.length}</td></tr><tr><th>Процент выполнения</th><td>{percent}%</td></tr></tbody></Table>
          <p className="fw-bold">{result}</p>
          <Button as={Link as any} to="/iso27001-checklist" variant="outline-dark">Пройти заново</Button>{' '}
          <Button variant="dark" onClick={exportReport}>Экспортировать отчёт</Button>
        </Card.Body></Card></div>
        <div className="col-md-7"><Card className="academic-card h-100"><Card.Body style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>{data.map((_, index) => <Cell key={index} fill={index === 0 ? '#198754' : '#dc3545'} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </Card.Body></Card></div>
      </div>
    </>
  );
}
