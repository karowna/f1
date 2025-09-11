import { PageClass } from '../types';
import { PageName } from '../enums';

export class NotFound implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log(`[NotFound] - Initialised NotFound class, param: ${this._param}`);
  }
  public loaded(): void {
    document.getElementById('app')!.role = 'main';
    document.getElementById('app')!.ariaLabel = '404 – Page Not Found';
    document.getElementById('links-section')!.style.display = 'none';
    console.log('NotFound page loaded', this._param);
  }

  public unloaded(): void {
    document.getElementById('app')!.removeAttribute('role');
    document.getElementById('app')!.removeAttribute('aria-label');
    document.getElementById('links-section')!.style.display = 'flex';
    console.log('NotFound page unloaded', this._param);
  }

  public getHTML(): string {
    return `
      <section id="not-found">
        <h1>404 – Page Not Found 🏎️💨</h1>
        <p> </p>
        <p>
          Looks like you’ve taken a wrong turn in the pit lane.<br>
          The page you’re looking for has already sped past the checkered flag.
        </p>
        <p>
          <a href="#${PageName.HOME}">🏁 Back to the starting grid</a>
        </p>
      </section>
    `;
  }
}
