import { it, expect, describe } from 'vitest';

import { linksSection } from '../../src/components/linksSection';

describe('Links Section tests', () => {
  it('should be instantiated', () => {
    // assert
    expect(linksSection).toBeInstanceOf(Object);
  });

  it('should contain the correct number of links', () => {
    // arrange
    const linksSectionElement = document.getElementById('links');
    const links = linksSectionElement.getElementsByTagName('a');
    // assert
    expect(linksSectionElement.getElementsByTagName('h3')[0].innerHTML).toBe('Useful Links');
    expect(links.length).toBe(4);
  });

  it('should have valid href attributes in links', () => {
    // arrange
    const linksSectionElement = document.getElementById('socials');
    const links = linksSectionElement.getElementsByTagName('a');
    // assert
    expect(linksSectionElement.getElementsByTagName('h3')[0].innerHTML).toBe('F1 Socials');
    expect(links.length).toBe(5);
  });
});
