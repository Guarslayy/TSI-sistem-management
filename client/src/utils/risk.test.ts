import { describe, expect, it } from 'vitest';
import { calculateALE, calculateIso27005Risk, calculateQualitativeRisk, calculateSLE, getRiskLevel } from './risk';

describe('client risk utilities', () => {
  it('calculates ISO 27005 risk', () => {
    expect(calculateIso27005Risk(5, 5, 5, 1)).toBe(100);
    expect(calculateIso27005Risk(1, 1, 1, 5)).toBe(0);
  });

  it('calculates quantitative risk', () => {
    expect(calculateSLE(50000, 0.3)).toBe(15000);
    expect(calculateALE(15000, 0.5)).toBe(7500);
  });

  it('maps levels', () => {
    expect(getRiskLevel(10)).toBe('Низкий');
    expect(getRiskLevel(30)).toBe('Средний');
    expect(getRiskLevel(60)).toBe('Высокий');
    expect(calculateQualitativeRisk(5, 5).level).toBe('Критический');
  });
});
