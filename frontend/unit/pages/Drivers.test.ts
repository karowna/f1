import { describe, it, expect, beforeEach } from 'vitest';

import { Drivers } from '../../src/pages';

describe('Drivers', () => {
  let drivers: Drivers;

  beforeEach(() => {
    // Arrange
    drivers = new Drivers('');
  });

  it('should initialise with param', () => {
    // Act
    const instance = new Drivers('test');
    // Assert
    expect(instance).toBeInstanceOf(Drivers);
  });

  it('should handle driver edge cases', () => {
    // Arrange
    const name = 'Kimi';
    const surname = 'Kimi Raikkonen';
    // Act
    const result = drivers['_handleDriverEdgeCases'](name, surname);
    // Assert
    expect(result).toBe('kimi-raikkonen');
  });

  it('should handle race names', () => {
    // Arrange
    const name = 'USA 2025';
    // Act
    const result = drivers['_handleRaceNames'](name);
    // Assert
    expect(result).toBe('USA ');
  });

  it('should handle position', () => {
    // Arrange
    const position = '-';
    // Act
    const result = drivers['_handlePosition'](position);
    // Assert
    expect(result).toBe('NC');
  });

  it('should convert date', () => {
    // Arrange
    const dateStr = '2025-06-01T00:00:00Z';
    // Act
    const result = drivers['_convertDate'](dateStr);
    // Assert
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should populate drivers', () => {
    // Arrange
    const data = {
      drivers: [{ driverId: '1', name: 'Lewis', surname: 'Hamilton' }],
      total: 1,
      season: '2025',
    };
    // Act
    const result = drivers['_populateDrivers'](data as any);
    // Assert
    expect(result.title).toContain('All 1 drivers');
    expect(result.elem).toBeInstanceOf(HTMLElement);
  });

  it('should populate driver', () => {
    // Arrange
    const data = {
      driver: {
        name: 'Lewis',
        surname: 'Hamilton',
        nationality: 'British',
        birthday: '1985-01-07',
        number: '44',
      },
      team: {
        teamName: 'Mercedes',
        teamNationality: 'German',
        teamId: 'mercedes',
      },
      results: [],
    };
    // Act
    const result = drivers['_populateDriver'](data as any);
    // Assert
    expect(result.title).toBe('Lewis Hamilton');
    expect(result.elem).toBeInstanceOf(HTMLElement);
  });

  it('should return HTML structure', () => {
    // Act
    const html = drivers.getHTML();
    // Assert
    expect(html).toContain('drivers-title');
    expect(html).toContain('drivers-desc');
    expect(html).toContain('drivers');
  });
});
