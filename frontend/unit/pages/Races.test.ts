import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Races } from '../../src/pages';
import { fetchData } from '../../src/utils';

describe('Races', () => {
  let races: Races;

  beforeEach(() => {
    // Arrange: Set up the Races instance
    races = new Races('testParam');
    // Mock fetchData methods
    vi.spyOn(fetchData, 'get').mockResolvedValue({
      total: 1,
      season: '2024',
      races: [
        {
          raceId: 'testParam',
          raceName: 'Test Race',
          winner: { driverId: 'd1', name: 'John', surname: 'Doe' },
          teamWinner: { teamId: 't1', teamName: 'Test Team' },
          schedule: { race: { date: '2024-06-01', time: '12:00:00Z' } },
          laps: 50,
        },
      ],
      video: 'test.mp4',
    });
    vi.spyOn(fetchData, 'post').mockResolvedValue({});
    vi.spyOn(fetchData, 'put').mockResolvedValue({});
    vi.spyOn(fetchData, 'delete').mockResolvedValue({});
    fetchData.token = 'testToken';
    fetchData.userId = 'u1';
  });

  it('should initialize with param', () => {
    // Act: Create a new Races instance
    // Assert: _param is set correctly
    expect(races['_param']).toBe('testParam');
  });

  it('should return correct HTML structure', () => {
    // Act
    const html = races.getHTML();
    // Assert
    expect(html).toContain('id="races-title"');
    expect(html).toContain('id="races-desc"');
    expect(html).toContain('id="races"');
  });

  it('should populate races table', () => {
    // Arrange
    (races as any)._data = {
      total: 1,
      season: '2024',
      races: [
        {
          raceId: 'testParam',
          raceName: 'Test Race',
          winner: { driverId: 'd1', name: 'John', surname: 'Doe' },
          teamWinner: { teamId: 't1', teamName: 'Test Team' },
          schedule: { race: { date: '2024-06-01', time: '12:00:00Z' } },
          laps: 50,
        },
      ],
    };
    // Act
    const result = (races as any)._populateRacesTable();
    // Assert
    expect(result.title).toContain('All 1 races');
    expect(result.elem).toBeDefined();
  });
});
