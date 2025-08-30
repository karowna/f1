import { PageClass } from '../types';

export class Races implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Races] - Initialised Races class');
  }
  // public loaded(): void {
  //   console.log('Races page loaded', this._param);
  // }
  //
  // public unloaded(): void {
  //   console.log('Races page loaded', this._param);
  // }

  public getHTML(): string {
    return `
      <h1>Races Page</h1>
      <p>This is the races page. Param: ${this._param}</p>
    `;
  }
}
