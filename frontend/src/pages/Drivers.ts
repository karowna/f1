import { PageClass, Drivers as IDrivers, Driver, DriverTeamRaceContent } from '../types';
import { fetchData } from '../utils';
import { handleCustomContent } from "../utils";

export class Drivers implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Drivers] - Initialised Drivers class');
  }
  
  private _handleDriverEdgeCases(name: string, surname: string): string {
    if (surname.startsWith('Kimi')) {
      [name, surname] = surname.split(' ');
    }
    return `${name}-${surname}`.toLowerCase();
  }

  private _handleRaceNames(name: string): string {
    if (name.includes('Italy')) {
      [name] = name.split(' e ');
    }
    return name.replace('2025', '');
  }

  private _handlePosition(position: string): string {
    if (position === '-') {
      position = 'NC';
    }
    return position;
  }
  
  private _populateDrivers(data: IDrivers): DriverTeamRaceContent {
    const ul = document.createElement('ul');
    ul.id = 'drivers-list';
    data.drivers.forEach((driver) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#drivers/${driver.driverId}`;
      a.textContent = `${driver.name} ${driver.surname}`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    return {
      title: `All ${data.total} drivers of the ${data.season} season`,
      desc: 'Click on a driver to see more details.',
      elem: ul,
    };
  }
  
  private _convertDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-GB').toString().split(',')[0];
  }
  
  private _populateDriverForAuthenticatedUser(data: Driver): HTMLElement {
    const results = document.createElement('div');
    results.id = 'driver-results';
    const resultsTitle = document.createElement('h2');
    resultsTitle.textContent = `Results for ${data.season} season`;
    results.appendChild(resultsTitle);
    const flexTable = document.createElement('div');
    flexTable.id = 'flex-table';
    flexTable.role = 'table';
    const raceRowHeader = document.createElement('div');
    raceRowHeader.className = 'flex-row header';
    raceRowHeader.role = 'row';
    raceRowHeader.innerHTML = `<div role="columnheader" class="flex-cell">Race</div><div role="columnheader" class="flex-cell">Date</div><div role="columnheader" class="flex-cell">Pos</div>`;
    flexTable.appendChild(raceRowHeader);
    data.results.forEach((r, i) => {
      const { race, result } = r;
      const raceRow = document.createElement('div');
      raceRow.className = 'flex-row';
      raceRow.role = 'row';
      i % 2 === 0 && raceRow.classList.add('alt');
      raceRow.innerHTML = `<div role="cell" class="flex-cell"><a href="#races/${race.raceId}">${this._handleRaceNames(race.name)}</a></div><div role="cell" class="flex-cell">${this._convertDate(race.date)}</div><div role="cell" class="flex-cell">${this._handlePosition(result.finishingPosition)}</div>`;
      flexTable.appendChild(raceRow);
    })
    results.appendChild(flexTable);
    return results;
  }
  
  private _populateDriver(data: Driver): DriverTeamRaceContent {
    const { name, surname, nationality, birthday, number } = data.driver;
    const { teamName, teamNationality, teamId } = data.team;
    const imgName = this._handleDriverEdgeCases(name, surname);
    const driver = document.createElement('div');
    const img = document.createElement('img');
    img.src = `https://www.kymillman.com/wp-content/uploads/f1/pages/driver-profiles/driver-faces/${imgName}-f1-driver-profile-picture.png`;
    img.alt = `${name} ${surname}`;
    driver.appendChild(img);
    const details = document.createElement('ul');
    details.id = 'driver-details';
    const allLi = [
      {Name: `${name} ${surname}`},
      {Nationality: nationality},
      {'Date of birth': birthday},
      { 'Car number': number },
      { 'Championship points': 'N/A' }, // TODO: Update when API supports it
      { Team: `<a href="#teams/${teamId}">${teamName}</a>` },
      { 'Team nationality': teamNationality },
    ];
    allLi.forEach((element) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${Object.keys(element)[0]}:</span> ${Object.values(element)[0]}`;
      details.appendChild(li);
    })
    handleCustomContent(details, 'driver', this._param);
    driver.appendChild(details);
    if (fetchData.token) {
      driver.appendChild(this._populateDriverForAuthenticatedUser(data));
    }
    return { title: `${name} ${surname}`, desc: '', elem: driver };
  }
  
  private async _populateContent(): Promise<DriverTeamRaceContent> {
    const path = `/drivers${this._param ? `/${this._param}` : ''}`;
    const data: IDrivers | Driver = await fetchData.get(path, false, true);
    return 'drivers' in data ? this._populateDrivers(data) : this._populateDriver(data);
  }
  
  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      let uiData: { title: string; desc: string; elem: HTMLElement };
      if (this._param) {
        console.log(`[Drivers] - Fetching details for driver ID ${this._param}...`);
        uiData = await this._populateContent();
      } else {
        console.log('[Drivers] - Fetching list of drivers...');
        uiData = await this._populateContent();
      }
      document.getElementById('drivers-title')!.innerHTML = uiData.title;
      document.getElementById('drivers-desc')!.innerHTML = uiData.desc;
      document.getElementById('drivers')!.appendChild(uiData.elem);
    } catch (error) {
      const parent = document.getElementById('drivers')!;
      parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
      parent.style.textAlign = 'center';
      console.error('[Drivers] - Error loading drivers data:', error);
    }
    document.getElementById('overlay')!.classList.toggle('hidden');
    console.log(`[Drivers] - Drivers page loaded: ${this._param}`);
  }

  public getHTML(): string {
    return `
      <h1 id="drivers-title"></h1>
      <div id="drivers-desc"></div>
      <div id="drivers"></div>
    `;
  }
}