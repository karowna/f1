import { Page } from '../types';

export function Races(param: string): Page {
  return {
    loaded: () => {
      console.log('Races page loaded', param);
    },
    unloaded: () => {
      console.log('Races page unloaded');
    },
    html: `
      <h1>Races Page</h1>
      <p>This is the races page. Param: ${param}</p>
    `
  }
}