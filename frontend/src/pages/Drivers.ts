import { PageClass } from '../types';
import { fetchData } from '../utils';

export class Drivers implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Drivers] - Initialised Drivers class');
  }
  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      if (this._param) {
        // Fetch driver details using this._param as driver ID
        // const driverDetails = await fetchData.get(`/drivers/${this._param}`, true, true);
        // Render driver details on the page
        console.log(`[Drivers] - Fetching details for driver ID: ${this._param}`);
      } else {
        console.log('[Drivers] - Fetching list of drivers...');
        const data = await fetchData.get('/drivers', false, true);
        console.log('[Drivers] - Drivers data:', data);
        // Render list of drivers on the page
      }
    } catch (error) {
      console.error('[Drivers] - Error loading drivers data:', error);
    }
    document.getElementById('overlay')!.classList.toggle('hidden');
    console.log(`[Drivers] - Drivers page loaded: ${this._param}`);
  }

  // public unloaded(): void {
  //   console.log('Drivers page loaded', this._param);
  // }

  public getHTML(): string {
    return `
      <h1>Drivers Page</h1>
      <p>This is the drivers page.</p>
    `;
  }
}