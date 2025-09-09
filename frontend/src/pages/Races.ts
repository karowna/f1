import {Driver, Drivers as IDrivers, DriverTeamRaceContent, PageClass, Races as IRaces} from '../types';
import { fetchData, handleRaceNames } from "../utils";

export class Races implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Races] - Initialised Races class');
  }
  
  private _populateRacesTable(data: IRaces): DriverTeamRaceContent {
    const title = `All ${data.total} races of the ${data.season} season`;
    const flexTable = document.createElement('div');
    flexTable.id = 'flex-table';
    flexTable.role = 'table';
    const raceRowHeader = document.createElement('div');
    raceRowHeader.className = 'flex-row header';
    raceRowHeader.role = 'row';
    raceRowHeader.innerHTML = `<div role="columnheader" class="flex-cell">Race</div><div role="columnheader" class="flex-cell">Winner</div><div role="columnheader" class="flex-cell">Team</div><div role="columnheader" class="flex-cell">Date</div>`;
    flexTable.appendChild(raceRowHeader);
    data.races.forEach((r, i) => {
      const { raceId, raceName, winner, teamWinner, schedule } = r;
      const raceRow = document.createElement('div');
      raceRow.className = 'flex-row';
      raceRow.role = 'row';
      i % 2 === 0 && raceRow.classList.add('alt');
      const winnerHTML = winner ? `<a href="#drivers/${winner?.driverId}">${winner?.name} ${winner?.surname}</a>` : 'N/A';
      const teamWinnerHTML = teamWinner ? `<a href="#teams/${teamWinner?.teamId}">${teamWinner?.teamName}</a>` : 'N/A';
      raceRow.innerHTML = `<div role="cell" class="flex-cell"><a href="#races/${raceId}">${handleRaceNames(raceName)}</a></div><div role="cell" class="flex-cell">${winnerHTML}</div><div role="cell" class="flex-cell">${teamWinnerHTML}</div><div role="cell" class="flex-cell">${new Date(schedule.race.date as string).toLocaleDateString('en-GB')}</div>`;
      flexTable.appendChild(raceRow);
    })
    return {title, desc: '', elem: flexTable}
  }
  
  private _populateRace(data: IRaces): DriverTeamRaceContent {
    const race = data.races.find((r) => r.raceId === this._param);
    if (race) {
      const details = document.createElement('ul');
      details.id = 'race-details';
      const winnerHTML = race.winner ? `<a href="#drivers/${race.winner?.driverId}">${race.winner?.name} ${race.winner?.surname}</a>` : 'N/A';
      const teamWinnerHTML = race.teamWinner ? `<a href="#teams/${race.teamWinner?.teamId}">${race.teamWinner?.teamName}</a>` : 'N/A';
      const allLi = [
        {Date: race.schedule.race.date},
        {Time: race.schedule.race.time},
        { Laps: race.laps },
        { Winner: winnerHTML },
        { 'Team winner': teamWinnerHTML },
      ];
      allLi.forEach((element) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${Object.keys(element)[0]}:</span> ${Object.values(element)[0]}`;
        details.appendChild(li);
      })
      
      const title = handleRaceNames(race.raceName);
      return {title, desc: '', elem: details}
    }
    return {title: 'Race Not Found', desc: '', elem: document.createElement('div')}
  }

  private async _populateContent(): Promise<DriverTeamRaceContent> {
    const data: IRaces = await fetchData.get('/races', false, true);
    return this._param ? this._populateRace(data) : this._populateRacesTable(data);
  }
  
  public async loaded(): Promise<void> {
    document.getElementById('overlay')!.classList.toggle('hidden');
    try {
      const uiData: { title: string; desc: string; elem: HTMLElement } = await this._populateContent();
      document.getElementById('races-title')!.innerHTML = uiData.title;
      document.getElementById('races-desc')!.innerHTML = uiData.desc;
      document.getElementById('races')!.appendChild(uiData.elem);
    } catch (error) {
      const parent = document.getElementById('races')!;
      parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
      parent.style.textAlign = 'center';
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
      <div id="races-desc"></div>
      <div id="races"></div>
    `;
  }
}
