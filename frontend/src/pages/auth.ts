import { Page } from '../types';

export function Auth(param: string): Page {
  return {
    loaded: () => {
      console.log('Auth page loaded', param);
    },
    unloaded: () => {
      console.log('Auth page unloaded');
    },
    html: `
      <h1>Auth Page</h1>
      <p>This is the authentication page. Param: ${param}</p>
    `
  }
}
