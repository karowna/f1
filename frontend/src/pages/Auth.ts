import { PageClass } from '../types';

export class Auth implements PageClass {
  private readonly _param: string;
  
  constructor(param: string) {
    this._param = param;
    console.log('[Auth] - Initialised Auth class');
  }
  // public loaded(): void {
  //   console.log('Auth page loaded', this._param);
  // }
  //
  // public unloaded(): void {
  //   console.log('Auth page loaded', this._param);
  // }
  
  public getHTML(): string {
    return `
      <h1>Auth Page</h1>
      <p>This is the authentication page. Param: ${this._param}</p>
    `;
  }
}
