import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Races } from '../../src/pages';
import { fetchData } from '../../src/utils';

describe('Races', () => {
  let races: Races;

  beforeEach(() => {
    // Arrange
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
    // Assert
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

  it('should return HTMLDialogElement from _getDialog', () => {
    // Act
    const dialog = (races as any)._getDialog();
    // Assert
    expect(dialog).toBeInstanceOf(HTMLDialogElement);
    expect(dialog.id).toBe('modal');
  });

  it('should return button element from _getBtn', () => {
    // Act
    const btn = (races as any)._getBtn('test-btn', 'Click Me');
    // Assert
    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect(btn.id).toBe('test-btn');
    expect(btn.innerText).toBe('Click Me');
  });

  it('should return textarea element from _getTextarea', () => {
    // Act
    const textarea = (races as any)._getTextarea('test-textarea');
    // Assert
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    expect(textarea.id).toBe('test-textarea');
    expect(textarea.rows).toBe(4);
    expect(textarea.maxLength).toBe(500);
  });

  it('should return span element from _getSpan', () => {
    // Act
    const span = (races as any)._getSpan('text', 'class', 'title');
    // Assert
    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect(span.innerText).toBe('text');
    expect(span.className).toBe('class');
    expect(span.title).toBe('title');
  });

  it('should generate correct table for races data', () => {
    // Arrange
    (races as any)._data = {
      total: 2,
      season: '2024',
      races: [
        {
          raceId: 'r1',
          raceName: 'Race One',
          winner: { driverId: 'd1', name: 'Alice', surname: 'Smith' },
          teamWinner: { teamId: 't1', teamName: 'Alpha Team' },
          schedule: { race: { date: '2024-06-01', time: '12:00:00Z' } },
          laps: 60,
        },
        {
          raceId: 'r2',
          raceName: 'Race Two',
          winner: null,
          teamWinner: null,
          schedule: { race: { date: '2024-07-01', time: '14:00:00Z' } },
          laps: 55,
        },
      ],
    };

    // Act
    const result = (races as any)._populateRacesTable();

    // Assert
    expect(result.title).toBe('All 2 races of the 2024 season');
    expect(result.elem).toBeDefined();
    expect(result.elem.innerHTML).toContain('Race One');
    expect(result.elem.innerHTML).toContain('Race Two');
    expect(result.elem.innerHTML).toContain('Alpha Team');
    expect(result.elem.innerHTML).toContain('N/A');
  });
});