import { useEffect, useState } from 'react';
import { Button, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import { ChecklistQuestion } from '../types';

export default function Iso27001Checklist() {
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'Да' | 'Нет'>>({});
  const navigate = useNavigate();
  useEffect(() => { api.get('/checklist/iso27001').then(({ data }) => setQuestions(data.questions)); }, []);
  const current = questions[index];
  const answer = (value: 'Да' | 'Нет') => current && setAnswers((a) => ({ ...a, [current.id]: value }));
  const next = async () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      const payload = Object.entries(answers).map(([question_id, answer]) => ({ question_id: Number(question_id), answer }));
      if (current && !answers[current.id]) payload.push({ question_id: current.id, answer: 'Нет' });
      await api.post('/checklist/iso27001/answers', { answers: payload });
      localStorage.setItem('iso27001Answers', JSON.stringify({ ...answers, ...(current && !answers[current.id] ? { [current.id]: 'Нет' } : {}) }));
      navigate('/iso27001-result');
    }
  };
  if (!current) return <p>Loading...</p>;
  return (
    <>
      <PageHeader title="ISO 27001" />
      <Card className="academic-card mx-auto" style={{ maxWidth: 780 }}>
        <Card.Body className="text-center p-4">
          <h2 className="h4 mb-3">{current.section}</h2>
          <div className="mb-3">{index + 1} / {questions.length}</div>
          <ProgressBar now={((index + 1) / questions.length) * 100} className="mb-4" />
          <p className="fs-5 mb-4">{current.question}</p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button size="lg" variant={answers[current.id] === 'Да' ? 'success' : 'outline-success'} onClick={() => answer('Да')}>Да</Button>
            <Button size="lg" variant={answers[current.id] === 'Нет' ? 'danger' : 'outline-danger'} onClick={() => answer('Нет')}>Нет</Button>
          </div>
          <Button variant="dark" onClick={next}>Далее</Button>
        </Card.Body>
      </Card>
    </>
  );
}
