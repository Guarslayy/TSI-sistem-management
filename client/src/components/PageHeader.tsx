export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="text-center text-muted mb-0">{subtitle}</p>}
    </header>
  );
}
