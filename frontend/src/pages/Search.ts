import { PageClass } from '../types';

export class Search implements PageClass {
  private readonly _param: string;
  
  constructor(param: string) {
    this._param = param;
    console.log('[Search] - Initialised Search class');
  }
  // public loaded(): void {
  //   console.log('Search page loaded', this._param);
  // }
  //
  // public unloaded(): void {
  //   console.log('Search page unloaded', this._param);
  // }
  
  public getHTML(): string {
    return `
      <h1>Search Page</h1>
      <p>This is the search page. Param: ${this._param}</p>
    `;
  }
}
