import { Button, Form, Modal } from 'react-bootstrap';

export type Field = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
};

type Props = {
  title: string;
  show: boolean;
  item: Record<string, any>;
  fields: Field[];
  onChange: (key: string, value: any) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function CrudModal({ title, show, item, fields, onChange, onClose, onSave }: Props) {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="row g-3">
          {fields.map((field) => (
            <Form.Group className={field.type === 'textarea' ? 'col-12' : 'col-md-6'} key={field.key}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'select' ? (
                <Form.Select value={item[field.key] ?? ''} onChange={(event) => onChange(field.key, event.target.value)}>
                  <option value="">Select</option>
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </Form.Select>
              ) : field.type === 'textarea' ? (
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={item[field.key] ?? ''}
                  onChange={(event) => onChange(field.key, event.target.value)}
                />
              ) : (
                <Form.Control
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={item[field.key] ?? ''}
                  onChange={(event) => onChange(field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
        <Button variant="dark" onClick={onSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
