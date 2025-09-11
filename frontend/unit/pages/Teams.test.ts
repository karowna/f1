import { describe, it, expect } from 'vitest';

import { Teams } from '../../src/pages';

describe('Drivers', () => {
  it('should initialise with param', () => {
    // Act
    const instance = new Teams('test');
    // Assert
    expect(instance).toBeInstanceOf(Teams);
  });
});
