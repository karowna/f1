import { Page } from '../types';

export function NotFound(param: string): Page {
  return {
    loaded: () => {
      console.log('NotFound page loaded', param);
    },
    unloaded: () => {
      console.log('Not Found page unloaded');
    },
    html: `
      <h1>NotFound Page</h1>
      <p>This is the bot found page. Param: ${param}</p>
    `
  }
}