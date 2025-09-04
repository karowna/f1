import { PageClass, Races as IRaces} from '../types';
import { fetchData } from "../utils";

export class Races implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Races] - Initialised Races class');
  }
  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      const data: IRaces = await fetchData.get('/races', false, true);
      document.getElementById('races-title')!.innerHTML = `All ${data.total} races of the ${data.season} season`;
      document.getElementById('races')!.innerHTML = data.races.map((r) => {
        return `Race: ${r.raceName} - Laps: ${r.laps} - Winner: ${r.winner?.name} ${r.winner?.surname} - Date: ${new Date(r.schedule.race.date as string).toLocaleDateString('en-GB')}`
      }).join('<br>');
    } catch (error) {
      document.getElementById('races')!.innerHTML = 'Oops! Something went wrong. Please try again later.';
      console.error('[Races] - Error loading races data:', error);
    }
    document.getElementById('overlay')!.classList.toggle('hidden');
    console.log(`[Races] - Races page loaded: ${this._param}`);
  }

  // public unloaded(): void {
  //   console.log('Races page loaded', this._param);
  // }

  public getHTML(): string {
    return `
      <h1 id="races-title"></h1>
<!--      <div id="races-desc"></div>-->
      <div id="races"></div>
    `;
  }
}
