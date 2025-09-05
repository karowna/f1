import { PageClass, Teams as ITeams, Team } from '../types';
import {fetchData, handleCustomContent} from '../utils';

export class Teams implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Teams] - Initialised Teams class');
  }
  
  private async _populateContent(): Promise<{ title: string; desc: string; elem: HTMLElement }> {
    const path = `/teams${this._param ? `/${this._param}` : ''}`;
    const data: ITeams | Team = await fetchData.get(path, false, true);
    if ('teams' in data) {
      const ul = document.createElement('ul');
      ul.id = 'teams-list';
      data.teams.forEach((team) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#teams/${team.teamId}`;
        a.textContent = team.teamName;
        li.appendChild(a);
        ul.appendChild(li);
      });
      return {
        title: `All ${data.total} teams of the ${data.season} season`,
        desc: 'Click on a team to see more details.',
        elem: ul,
      };
    }
    const { teamId, teamName, teamNationality, firstAppeareance, constructorsChampionships, driversChampionships } = data.team[0];
    const team = document.createElement('div');
    const logoContainer = document.createElement('div');
    const img = document.createElement('img');
    img.src = `./assets/logos/${teamId}.png`;
    img.alt = `${teamName} logo`;
    logoContainer.appendChild(img);
    team.appendChild(logoContainer);
    const details = document.createElement('ul');
    details.id = 'team-details';
    const liName = document.createElement('li');
    liName.innerHTML = `<span>Name:</span> ${teamName}`;
    details.appendChild(liName);
    const liNationality = document.createElement('li');
    liNationality.innerHTML = `<span>Nationality:</span> ${teamNationality}`;
    details.appendChild(liNationality);
    const liFirstAppeareance = document.createElement('li');
    liFirstAppeareance.innerHTML = `<span>First appeareance: </span> ${firstAppeareance}`;
    details.appendChild(liFirstAppeareance);
    const liConstructorsChampionships = document.createElement('li');
    liConstructorsChampionships.innerHTML = `<span>Constructors championships:</span> ${constructorsChampionships}`;
    details.appendChild(liConstructorsChampionships);
    const liDriversChampionships = document.createElement('li');
    liDriversChampionships.innerHTML = `<span>Drivers championships:</span> ${driversChampionships}`;
    details.appendChild(liDriversChampionships);
    handleCustomContent(details, 'team', teamId);
    team.appendChild(details);
    return { title: `${teamName}`, desc: '', elem: team };
  }

  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      let uiData: { title: string; desc: string; elem: HTMLElement };
      if (this._param) {
        console.log(`[Teams] - Fetching details for team ID ${this._param}...`);
        uiData = await this._populateContent();
      } else {
        console.log('[Teams] - Fetching list of teams...');
        uiData = await this._populateContent();
      }
      document.getElementById('teams-title')!.innerHTML = uiData.title;
      document.getElementById('teams-desc')!.innerHTML = uiData.desc;
      document.getElementById('teams')!.appendChild(uiData.elem);
    } catch (error) {
      const parent = document.getElementById('teams')!;
      parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
      parent.style.textAlign = 'center';
      console.error('[Teams] - Error loading teams data:', error);
    }
    document.getElementById('overlay')!.classList.toggle('hidden');
    console.log(`[Teams] - Teams page loaded: ${this._param}`);
  }

  // public unloaded(): void {
  //   document.getElementById('teams-title')!.innerHTML = '';
  //   document.getElementById('teams-desc')!.innerHTML = '';
  //   document.getElementById('teams')!.innerHTML = '';
  //   console.log(`[Teams] - Teams page unloaded: ${this._param}`);
  // }

  public getHTML(): string {
    return `
      <h1 id="teams-title"></h1>
      <div id="teams-desc"></div>
      <div id="teams"></div>
    `;
  }
}
