import { PageClass, Drivers as IDrivers, Driver, DriverTeamRaceContent } from '../types';
import { fetchData, handleCustomContent, appendListItems, getFlexTable, getFlexTableRow, setErrorMsg } from '../utils';

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
    const flexTable = getFlexTable(['Race', 'Date', 'Pos']);
    data.results.forEach((r, i) => {
      const { race, result } = r;
      const content = [
        `<a href="#races/${race.raceId}">${this._handleRaceNames(race.name)}</a>`,
        this._convertDate(race.date),
        this._handlePosition(result.finishingPosition),
      ];
      flexTable.appendChild(getFlexTableRow(content, i));
    });
    results.appendChild(flexTable);
    return results;
  }

  private async _populateDriver(data: Driver): Promise<DriverTeamRaceContent> {
    const { name, surname, nationality, birthday, number, points } = data.driver;
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
      { Name: `${name} ${surname}` },
      { Nationality: nationality },
      { 'Date of birth': birthday },
      { 'Car number': number },
      { 'Championship points': points ?? 'N/A' },
      { Team: `<a href="#teams/${teamId}">${teamName}</a>` },
      { 'Team nationality': teamNationality },
    ];
    appendListItems(details, allLi);
    console.log('>>>>>>///////', this._param)
    await handleCustomContent(details, 'driver', this._param);
    driver.appendChild(details);
    if (fetchData.loggedIn) {
      driver.appendChild(this._populateDriverForAuthenticatedUser(data));
    }
    return { title: `${name} ${surname}`, desc: '', elem: driver };
  }

  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      console.log(`[Drivers] - Fetching ${this._param ? `details for driver ID ${this._param}` : 'Fetching list of drivers'}...`);
      const path = `/drivers${this._param ? `/${this._param}` : ''}`;
      const data: IDrivers | Driver = await fetchData.get(path, fetchData.loggedIn, true);
      const uiData = 'drivers' in data ? this._populateDrivers(data) : await this._populateDriver(data);
      document.getElementById('drivers-title')!.innerHTML = uiData.title;
      document.getElementById('drivers-desc')!.innerHTML = uiData.desc;
      document.getElementById('drivers')!.appendChild(uiData.elem);
    } catch (error) {
      setErrorMsg('drivers', error);
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
