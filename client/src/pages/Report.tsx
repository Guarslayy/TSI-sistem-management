import { useEffect, useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';

export default function Report() {
  const [markdown, setMarkdown] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  useEffect(() => { api.get('/report').then(({ data }) => setMarkdown(data.markdown)); }, []);
  const download = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportPdf = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 1 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
    pdf.save('final-report.pdf');
  };

  return (
    <>
      <PageHeader title="Итоговый отчёт" />
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button variant="dark" onClick={exportPdf}>Экспорт PDF</Button>
        <Button variant="outline-dark" onClick={() => download('final-report.md', markdown, 'text/markdown;charset=utf-8')}>Экспорт Markdown</Button>
        <Button variant="outline-dark" href="/api/export/assets.csv">Экспорт CSV реестра активов</Button>
        <Button variant="outline-dark" href="/api/export/risks.csv">Экспорт CSV реестра рисков</Button>
      </div>
      <Card className="academic-card"><Card.Body>
        <div ref={reportRef} style={{ whiteSpace: 'pre-wrap', fontFamily: 'Arial, Helvetica, sans-serif' }}>{markdown}</div>
      </Card.Body></Card>
    </>
  );
}
