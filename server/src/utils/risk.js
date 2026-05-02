function calculateIso27005Risk(tp, vl, sev, det) {
  const values = [tp, vl, sev, det].map(Number);
  if (values.some((value) => value < 1 || value > 5 || Number.isNaN(value))) {
    throw new Error('TP, VL, SEV and DET must be numbers from 1 to 5.');
  }
  return Math.round((((tp - 1) + (vl - 1) + (sev - 1) + (5 - det)) / 16) * 100);
}

function getRiskLevel(score) {
  if (score < 20) return 'Низкий';
  if (score <= 40) return 'Средний';
  return 'Высокий';
}

function calculateSLE(assetValue, exposureFactor) {
  return Number(assetValue) * Number(exposureFactor);
}

function calculateALE(sle, aro) {
  return Number(sle) * Number(aro);
}

function calculateQualitativeRisk(probability, impact) {
  const score = Number(probability) * Number(impact);
  if (score <= 4) return { score, level: 'Незначительный', color: 'success' };
  if (score <= 10) return { score, level: 'Умеренный', color: 'warning' };
  if (score <= 16) return { score, level: 'Существенный', color: 'orange' };
  return { score, level: 'Критический', color: 'danger' };
}

module.exports = {
  calculateIso27005Risk,
  getRiskLevel,
  calculateSLE,
  calculateALE,
  calculateQualitativeRisk
};
