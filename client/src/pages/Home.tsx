import { Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-shell">
      <Card className="academic-card home-panel p-4">
        <Card.Body className="text-center">
          <h1 className="fw-bold mb-2">ISO CyberSecurity Certification</h1>
          <h2 className="h4 mb-4">Система менеджмента информационной безопасности</h2>
          <Form.Control className="mx-auto mb-4 text-center" size="lg" defaultValue="MediNova Clinic SRL" aria-label="Company name" />
          <div className="d-grid gap-3 d-md-flex justify-content-center">
            <Button as={Link as any} to="/iso27001-checklist" variant="outline-dark" size="lg">ISO 27001 Checklist</Button>
            <Button as={Link as any} to="/iso27005-checklist" variant="outline-dark" size="lg">ISO 27005 Оценка рисков</Button>
          </div>
          <div className="d-grid gap-3 d-md-flex justify-content-center mt-3">
            <Button as={Link as any} to="/organization" variant="dark">Профиль организации</Button>
            <Button as={Link as any} to="/report" variant="dark">Итоговый отчёт</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
