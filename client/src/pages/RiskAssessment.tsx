import { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Modal, Table } from 'react-bootstrap';
import { getList, saveItem } from '../api/client';
import PageHeader from '../components/PageHeader';
import RiskBadge from '../components/RiskBadge';
import { calculateIso27005Risk, getRiskLevel } from '../utils/risk';
import { Asset, Risk } from '../types';

const scale = [1, 2, 3, 4, 5];

export default function RiskAssessment() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<Risk | null>(null);
  const assetName = (id: number) => assets.find((asset) => asset.id === id)?.name || String(id);
  const load = () => Promise.all([getList<Risk>('/risks'), getList<Asset>('/assets')]).then(([r, a]) => { setRisks(r); setAssets(a); });
  useEffect(() => { load(); }, []);

  const updateRisk = async (risk: Risk, key: 'tp' | 'vl' | 'sev' | 'det', value: number) => {
    const updated = { ...risk, [key]: value };
    updated.risk_score = calculateIso27005Risk(updated.tp, updated.vl, updated.sev, updated.det);
    updated.risk_level = getRiskLevel(updated.risk_score);
    setRisks((current) => current.map((item) => item.id === risk.id ? updated : item));
    await saveItem<Risk>('/risks', updated);
  };

  return (
    <>
      <PageHeader title="ISO 27005 — Оценка рисков" subtitle="Оценка рисков информационной безопасности" />
      <div className="row g-3 mb-3">
        <div className="col-md-6"><Card className="academic-card h-100"><Card.Body><h2 className="h5">Сокращения</h2><p className="mb-1">TP — вероятность угрозы</p><p className="mb-1">VL — уровень уязвимости</p><p className="mb-1">SEV — серьёзность / влияние на бизнес</p><p className="mb-0">DET — возможность обнаружения</p></Card.Body></Card></div>
        <div className="col-md-6"><Card className="academic-card h-100"><Card.Body><h2 className="h5">Индикаторы</h2><p><Badge bg="success">зелёный</Badge> риск &lt; 20%</p><p><Badge bg="warning" text="dark">оранжевый</Badge> риск от 20% до 40%</p><p className="mb-0"><Badge bg="danger">красный</Badge> риск &gt; 40%</p></Card.Body></Card></div>
      </div>
      <div className="table-responsive">
        <Table bordered hover size="sm">
          <thead><tr><th>ID риска</th><th>Актив</th><th>Уязвимость</th><th>Угроза</th><th>Описание</th><th>TP</th><th>VL</th><th>SEV</th><th>DET</th><th>Риск %</th><th>Уровень риска</th><th>Совет</th></tr></thead>
          <tbody>{risks.map((risk) => <tr key={risk.id} className={risk.risk_score < 20 ? 'risk-low' : risk.risk_score <= 40 ? 'risk-medium' : 'risk-high'}>
            <td>{risk.id}</td><td>{assetName(risk.asset_id)}</td><td>{risk.vulnerability}</td><td>{risk.threat}</td><td>{risk.description}</td>
            {(['tp', 'vl', 'sev', 'det'] as const).map((key) => <td key={key}><Form.Select size="sm" value={risk[key]} onChange={(e) => updateRisk(risk, key, Number(e.target.value))}>{scale.map((value) => <option key={value}>{value}</option>)}</Form.Select></td>)}
            <td>{risk.risk_score}%</td><td><RiskBadge level={risk.risk_level} /></td><td><Button size="sm" variant="outline-dark" onClick={() => setSelected(risk)}>Advice</Button></td>
          </tr>)}</tbody>
        </Table>
      </div>
      <Modal show={Boolean(selected)} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton><Modal.Title>Совет по обработке риска</Modal.Title></Modal.Header>
        <Modal.Body>
          {selected && <dl>
            <dt>рекомендуемая мера контроля</dt><dd>{selected.recommended_control}</dd>
            <dt>тип контроля</dt><dd>{selected.control_type}</dd>
            <dt>функция контроля</dt><dd>{selected.control_function}</dd>
            <dt>приоритет</dt><dd>{selected.priority}</dd>
            <dt>остаточный риск</dt><dd>{selected.residual_risk}</dd>
            <dt>шаги внедрения</dt><dd>{selected.implementation_steps}</dd>
          </dl>}
        </Modal.Body>
      </Modal>
    </>
  );
}
