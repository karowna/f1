import { PageClass, Drivers as IDrivers, Driver } from '../types';
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
  
  private async _populateContent(): Promise<{ title: string; desc: string; elem: HTMLElement }> {
    const path = `/drivers${this._param ? `/${this._param}` : ''}`;
    const data: IDrivers | Driver = await fetchData.get(path, false, true);
    if ('drivers' in data) {
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
    const liName = document.createElement('li');
    liName.innerHTML = `<span>Name:</span> ${name} ${surname}`;
    details.appendChild(liName);
    const liNationality = document.createElement('li');
    liNationality.innerHTML = `<span>Nationality:</span> ${nationality}`;
    details.appendChild(liNationality);
    const liBirthday = document.createElement('li');
    liBirthday.innerHTML = `<span>Date of birth:</span> ${birthday}`;
    details.appendChild(liBirthday);
    const liNUmber = document.createElement('li');
    liNUmber.innerHTML = `<span>Date of birth:</span> ${number}`;
    details.appendChild(liNUmber);
    const liTeam = document.createElement('li');
    liTeam.innerHTML = `<span>Team:</span> <a href="#teams/${teamId}">${teamName}</a>`;
    details.appendChild(liTeam);
    const liTeamNationality = document.createElement('li');
    liTeamNationality.innerHTML = `<span>Team nationality:</span> ${teamNationality}`;
    details.appendChild(liTeamNationality);
    handleCustomContent(details, 'driver', this._param);
    driver.appendChild(details);
    if (fetchData.token) {
      const results = document.createElement('div');
      results.id = 'driver-results';
      const resultsTitle = document.createElement('h2');
      resultsTitle.textContent = `Results for ${data.season} season`;
      results.appendChild(resultsTitle);
      const resultsList = document.createElement('ul');
      data.results.forEach((r) => {
        const { race, result } = r;
        const raceLi = document.createElement('li');
        raceLi.innerHTML = `<span>Race:</span> ${this._handleRaceNames(race.name)}<br> &nbsp;&nbsp;&#8226; <span>Date:</span> ${race.date}<br> &nbsp;&nbsp;&#8226; <span>Finishing position:</span> ${this._handlePosition(result.finishingPosition)}`;
        resultsList.appendChild(raceLi);
      })
      results.appendChild(resultsList);
      details.appendChild(results);
    }
    return { title: `${name} ${surname}`, desc: '', elem: driver };
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

  // public unloaded(): void {
  //   document.getElementById('drivers-title')!.innerHTML = '';
  //   document.getElementById('drivers-desc')!.innerHTML = '';
  //   document.getElementById('drivers')!.innerHTML = '';
  //   console.log(`[Drivers] - Drivers page unloaded: ${this._param}`);
  // }

  public getHTML(): string {
    return `
      <h1 id="drivers-title"></h1>
      <div id="drivers-desc"></div>
      <div id="drivers"></div>
    `;
  }
}