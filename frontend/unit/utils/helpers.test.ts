import { vi, describe, expect, it, beforeEach } from 'vitest';

import { fetchData, handleCustomContent, handleRaceNames, appendListItems, getFlexTable, getFlexTableRow, setErrorMsg } from '../../src/utils';
import { PageName } from '../../src/enums';

describe('Helpers unit tests', () => {
  describe('handleCustomContent tests', () => {
    it('should set login msg when there is no token', () => {
      // Arrange
      const div = document.createElement('div');
      // Act
      handleCustomContent(div, 'driver', '123');
      // Assert
      expect(div.getElementsByTagName('p')[0].innerHTML).toBe(`<a href="#${PageName.AUTH}">Log in</a> for more...`);
    });

    it('should handle favourite message', async () => {
      // Arrange
      const mockResponse = { favourite: true };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
        ok: true,
        status: 200,
      });
      globalThis.fetch = mockFetch;
      document.body.innerHTML = `<div id="overlay" class="hidden"></div>
        <div id="favourite-span" class="favourite"></div>
        <div id="favourite-text"><span></span></div>
    `;
      const div = document.createElement('div');
      fetchData.token = '123';

      // Act
      handleCustomContent(div, 'driver', '123');
      const pMsg = div.getElementsByTagName('p')[0];

      // Assert
      expect(pMsg.innerHTML).toBe('<span>One of your favourite teams </span><span id="favourite-span" class="favourite">&nbsp;❤</span>');

      // Act
      pMsg.click();
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toBe('http://localhost:3000/favourites/driver/123');
      expect(mockFetch.mock.calls[0][1]).toStrictEqual({
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fetchData.token}`,
        }),
        body: JSON.stringify({ favourite: true }),
      });
      await new Promise(process.nextTick);
      expect(document.getElementById('favourite-text').innerHTML).toBe('<span>Click to set as favourite driver </span>');
    });
  });

  describe('handleRaceNames', () => {
    it('should remove "2025" from the race name', () => {
      // Arrange
      const name = 'Grand Prix 2025';
      // Act
      const result = handleRaceNames(name);
      // Assert
      expect(result).toBe('Grand Prix ');
    });

    it('should split Italian race names on " e " and remove "2025"', () => {
      // Arrange
      const name = 'Italy e San Marino 2025';
      // Act
      const result = handleRaceNames(name);
      // Assert
      expect(result).toBe('Italy');
    });

    it('should not modify names without "Italy" or "2025"', () => {
      // Arrange
      const name = 'Monaco Grand Prix';
      // Act
      const result = handleRaceNames(name);
      // Assert
      expect(result).toBe('Monaco Grand Prix');
    });

    it('should handle names with "Italy" but no " e "', () => {
      // Arrange
      const name = 'Italy Grand Prix 2025';
      // Act
      const result = handleRaceNames(name);
      // Assert
      expect(result).toBe('Italy Grand Prix ');
    });
  });

  describe('appendListItems', () => {
    let parent: HTMLElement;

    beforeEach(() => {
      parent = document.createElement('ul');
    });

    it('should append list items for each object in allLi', () => {
      // Arrange
      const allLi = [{ name: 'Lewis' }, { team: 'Mercedes' }];
      // Act
      appendListItems(parent, allLi);
      // Assert
      expect(parent.children.length).toBe(2);
      expect(parent.children[0].textContent).toContain('name: Lewis');
      expect(parent.children[1].textContent).toContain('team: Mercedes');
    });

    it('should handle empty allLi array', () => {
      // Arrange
      const allLi: {}[] = [];
      // Act
      appendListItems(parent, allLi);
      // Assert
      expect(parent.children.length).toBe(0);
    });

    it('should create li elements with correct structure', () => {
      // Arrange
      const allLi = [{ country: 'Italy' }];
      // Act
      appendListItems(parent, allLi);
      // Assert
      const li = parent.querySelector('li');
      expect(li).not.toBeNull();
      expect(li!.innerHTML).toContain('<span>country:</span> Italy');
    });
  });

  describe('getFlexTable', () => {
    it('creates a flex table with correct headings', () => {
      // Arrange
      const headings = ['Name', 'Country', 'Points'];
      // Act
      const table = getFlexTable(headings);
      // Assert
      expect(table).toBeInstanceOf(HTMLElement);
      expect(table.id).toBe('flex-table');
      expect(table.role).toBe('table');
      const headerRow = table.querySelector('.flex-row.header');
      expect(headerRow).not.toBeNull();
      expect(headerRow?.role).toBe('row');
      const headerCells = headerRow?.querySelectorAll('.flex-cell');
      expect(headerCells?.length).toBe(headings.length);
      headings.forEach((heading, i) => {
        expect(headerCells?.[i].textContent).toBe(heading);
        expect(headerCells?.[i].getAttribute('role')).toBe('columnheader');
      });
    });

    it('returns an empty table if headings is empty', () => {
      // Arrange
      const headings: string[] = [];
      // Act
      const table = getFlexTable(headings);
      // Assert
      expect(table).toBeInstanceOf(HTMLElement);
      const headerRow = table.querySelector('.flex-row.header');
      expect(headerRow).not.toBeNull();
      const headerCells = headerRow?.querySelectorAll('.flex-cell');
      expect(headerCells?.length).toBe(0);
    });
  });

  describe('getFlexTableRow', () => {
    it('should create a flex row with correct content', () => {
      // Arrange
      const content = ['A', 'B', 'C'];
      const index = 1;
      // Act
      const row = getFlexTableRow(content, index);
      // Assert
      expect(row.className).toBe('flex-row');
      expect(row.role).toBe('row');
      expect(row.innerHTML).toContain('<div role="cell" class="flex-cell">A</div>');
      expect(row.innerHTML).toContain('<div role="cell" class="flex-cell">B</div>');
      expect(row.innerHTML).toContain('<div role="cell" class="flex-cell">C</div>');
      expect(row.classList.contains('alt')).toBe(false);
    });

    it('should add alt class for even index', () => {
      // Arrange
      const content = ['X', 'Y'];
      const index = 2;
      // Act
      const row = getFlexTableRow(content, index);
      // Assert
      expect(row.classList.contains('alt')).toBe(true);
    });
  });

  describe('setErrorMsg', () => {
    it('should set error message and center text', () => {
      const parent = document.createElement('div');
      parent.id = 'testElem';
      document.body.appendChild(parent);
      // Act
      setErrorMsg('testElem', 'Test error');
      // Assert
      expect(parent.innerHTML).toBe('Oops! Something went wrong. Please try again later.');
      expect(parent.style.textAlign).toBe('center');
    });
  });
});
