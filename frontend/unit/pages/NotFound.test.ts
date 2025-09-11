import { describe, expect, it } from 'vitest';

import { NotFound } from '../../src/pages';

describe('NotFound Page tests', () => {
  it('should render not found page content', () => {
    // Arrange
    const notFound = new NotFound('');
    // Act
    const content = notFound.getHTML();

    // Assert
    expect(content).toContain(`<section id="not-found">
        <h1>404 – Page Not Found 🏎️💨</h1>
        <p> </p>
        <p>
          Looks like you’ve taken a wrong turn in the pit lane.<br>
          The page you’re looking for has already sped past the checkered flag.
        </p>
        <p>
          <a href="#home">🏁 Back to the starting grid</a>
        </p>
      </section>`);
  });
});
