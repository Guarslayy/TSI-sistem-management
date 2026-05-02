import { describe, expect, it } from 'vitest';
import riskUtils from './risk.js';

const {
  calculateIso27005Risk,
  getRiskLevel,
  calculateSLE,
  calculateALE,
  calculateQualitativeRisk
} = riskUtils;

describe('risk utilities', () => {
  it('calculates ISO 27005 normalized risk', () => {
    expect(calculateIso27005Risk(5, 5, 5, 1)).toBe(100);
    expect(calculateIso27005Risk(1, 1, 1, 5)).toBe(0);
    expect(calculateIso27005Risk(3, 3, 4, 2)).toBe(63);
  });

  it('maps risk levels', () => {
    expect(getRiskLevel(19)).toBe('Низкий');
    expect(getRiskLevel(20)).toBe('Средний');
    expect(getRiskLevel(41)).toBe('Высокий');
  });

  it('calculates SLE and ALE', () => {
    expect(calculateSLE(10000, 0.4)).toBe(4000);
    expect(calculateALE(4000, 2)).toBe(8000);
  });

  it('calculates qualitative risk', () => {
    expect(calculateQualitativeRisk(1, 2).level).toBe('Незначительный');
    expect(calculateQualitativeRisk(3, 3).level).toBe('Умеренный');
    expect(calculateQualitativeRisk(4, 4).level).toBe('Существенный');
    expect(calculateQualitativeRisk(5, 5).level).toBe('Критический');
  });
});
