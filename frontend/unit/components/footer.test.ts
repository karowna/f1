import { it, expect, describe } from 'vitest';

import { footer } from '../../src/components/footer';

describe('Footer tests', () => {
  it('should be instantiated', () => {
    // assert
    expect(footer).toBeInstanceOf(Object);
  });

  it('should set the current year in the footer', () => {
    // arrange
    const year = new Date().getFullYear();
    const footerElement = document.getElementsByTagName('footer')[0];
    const rights = footerElement.getElementsByTagName('p')[0];
    // assert
    expect(rights.innerHTML).toContain(`© ${year} F1 Portal. All rights reserved`);
  });

  it('should toggle theme on button click', () => {
    // arrange
    const root = document.documentElement;
    const themeToggleButton = document.createElement('button');
    themeToggleButton.id = 'theme-toggle';
    document.body.appendChild(themeToggleButton);
    const initialTheme = root.getAttribute('data-theme') || 'light';
    // act
    themeToggleButton.click();
    const toggledTheme = root.getAttribute('data-theme');
    // assert
    expect(toggledTheme).not.toBe(initialTheme);

    // Clean up
    document.body.removeChild(themeToggleButton);
  });
});
