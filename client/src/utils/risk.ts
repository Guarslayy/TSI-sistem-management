export function calculateIso27005Risk(tp: number, vl: number, sev: number, det: number): number {
  return Math.round((((tp - 1) + (vl - 1) + (sev - 1) + (5 - det)) / 16) * 100);
}

export function getRiskLevel(score: number): 'Низкий' | 'Средний' | 'Высокий' {
  if (score < 20) return 'Низкий';
  if (score <= 40) return 'Средний';
  return 'Высокий';
}

export function calculateSLE(assetValue: number, exposureFactor: number): number {
  return assetValue * exposureFactor;
}

export function calculateALE(sle: number, aro: number): number {
  return sle * aro;
}

export function calculateQualitativeRisk(probability: number, impact: number) {
  const score = probability * impact;
  if (score <= 4) return { score, level: 'Незначительный', color: 'success' };
  if (score <= 10) return { score, level: 'Умеренный', color: 'warning' };
  if (score <= 16) return { score, level: 'Существенный', color: 'orange' };
  return { score, level: 'Критический', color: 'danger' };
}
