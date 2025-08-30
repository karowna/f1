import { PageClass } from '../types';

export class NotFound implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[NotFound] - Initialised NotFound class');
  }

  public getHTML(): string {
    return `
      <h1>NotFound Page</h1>
      <p>This is the not found page. Param: ${this._param}</p>
    `;
  }
}
