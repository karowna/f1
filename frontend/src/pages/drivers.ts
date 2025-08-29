import { Page } from '../types';

export function Drivers(param: string): Page {
  return {
    loaded: () => {
      console.log('Drivers page loaded', param);
    },
    unloaded: () => {
      console.log('Drivers page unloaded');
    },
    html: `
      <h1>Drivers Page</h1>
      <p>This is the drivers page. Param: ${param}</p>
    `
  }
}