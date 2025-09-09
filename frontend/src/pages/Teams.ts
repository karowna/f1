import { PageClass, Teams as ITeams, Team, DriverTeamRaceContent } from '../types';
import {fetchData, handleCustomContent} from '../utils';

export class Teams implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Teams] - Initialised Teams class');
  }
  
  private _populateTeams(data: ITeams): DriverTeamRaceContent {
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
  
  private _populateTeam(data: Team): DriverTeamRaceContent {
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
    const allLi = [
      {Name: teamName},
      {Nationality: teamNationality},
      {'First appearance': firstAppeareance},
      { 'Championship points': 'N/A' }, // TODO: Update when API supports it
      { 'Constructors championships': constructorsChampionships ?? '0' },
      { 'Drivers championships': driversChampionships ?? '0' },
    ];
    allLi.forEach((element) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${Object.keys(element)[0]}:</span> ${Object.values(element)[0]}`;
      details.appendChild(li);
    })
    handleCustomContent(details, 'team', teamId);
    team.appendChild(details);
    return { title: `${teamName}`, desc: '', elem: team };
  }
  
  private async _populateContent(): Promise<{ title: string; desc: string; elem: HTMLElement }> {
    const path = `/teams${this._param ? `/${this._param}` : ''}`;
    const data: ITeams | Team = await fetchData.get(path, false, true);
    return 'teams' in data ? this._populateTeams(data) : this._populateTeam(data);
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

  public getHTML(): string {
    return `
      <h1 id="teams-title"></h1>
      <div id="teams-desc"></div>
      <div id="teams"></div>
    `;
  }
}
