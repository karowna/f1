import { PageClass } from '../types';

export class Drivers implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
  }
  public loaded(): void {
    console.log('Drivers page loaded', this._param);
  }

  public unloaded(): void {
    console.log('Drivers page loaded', this._param);
  }

  public getHTML(): string {
    return `
      <h1>Drivers Page</h1>
      <p>This is the drivers page. Param: ${this._param}</p>
    `;
  }
}