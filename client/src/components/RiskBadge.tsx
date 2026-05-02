import { Badge } from 'react-bootstrap';

export default function RiskBadge({ level, score }: { level: string; score?: number }) {
  const variant = level === 'Высокий' || level === 'Критический' ? 'danger' : level === 'Средний' || level === 'Умеренный' || level === 'Существенный' ? 'warning' : 'success';
  return <Badge bg={variant} text={variant === 'warning' ? 'dark' : undefined}>{score !== undefined ? `${score}% · ` : ''}{level}</Badge>;
}
