import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Teams } from '../../src/pages';

describe('Drivers', () => {
  let teams: Teams;

  beforeEach(() => {
    // Arrange
    teams = new Teams('test');
  });

  it('should initialise with param', () => {
    // Assert
    expect(teams).toBeInstanceOf(Teams);
  });

  it('getHTML should return correct HTML structure', () => {
    // Act
    const html = teams.getHTML();
    // Assert
    expect(html).toContain('id="teams-title"');
    expect(html).toContain('id="teams-desc"');
    expect(html).toContain('id="teams"');
  });

  it('_populateTeams should return correct DriverTeamRaceContent', () => {
    // Arrange
    const data = {
      teams: [
        { teamId: 'mercedes', teamName: 'Mercedes' },
        { teamId: 'ferrari', teamName: 'Ferrari' }
      ],
      total: 2,
      season: '2024'
    };
    // Act
    // @ts-ignore
    const result = teams._populateTeams(data);
    // Assert
    expect(result.title).toBe('All 2 teams of the 2024 season');
    expect(result.desc).toBe('Click on a team to see more details.');
    expect(result.elem).toBeInstanceOf(HTMLElement);
    expect(result.elem.querySelectorAll('li').length).toBe(2);
  });

  it('_populateTeam should return correct DriverTeamRaceContent', async () => {
    // Arrange
    const data = {
      team: [{
        teamId: 'redbull',
        teamName: 'Red Bull',
        teamNationality: 'Austrian',
        firstAppeareance: '2005',
        constructorsChampionships: 6,
        driversChampionships: 7
      }]
    };
    // Mock appendListItems and handleCustomContent
    vi.mock('../../src/utils', () => ({
      appendListItems: vi.fn(),
      handleCustomContent: vi.fn().mockResolvedValue(undefined)
    }));
    // Act
    // @ts-ignore
    const result = await teams._populateTeam(data);
    // Assert
    expect(result.title).toBe('Red Bull');
    expect(result.elem).toBeInstanceOf(HTMLElement);
    expect(result.elem.querySelector('img')?.src).toContain('redbull.png');
  });
});
