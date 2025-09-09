import { DriverTeamRaceContent, PageClass, Races as IRaces} from '../types';
import {appendListItems, fetchData, handleRaceNames, getFlexTable, getFlexTableRow, setErrorMsg} from "../utils";

export class Races implements PageClass {
  private readonly _param: string;

  constructor(param: string) {
    this._param = param;
    console.log('[Races] - Initialised Races class');
  }
  
  private _populateRacesTable(data: IRaces): DriverTeamRaceContent {
    const title = `All ${data.total} races of the ${data.season} season`;
    const flexTable = getFlexTable(['Race', 'Winner', 'Team', 'Date']);
    data.races.forEach((r, i) => {
      const { raceId, raceName, winner, teamWinner, schedule } = r;
      const content = [
        `<a href="#races/${raceId}">${handleRaceNames(raceName)}</a>`,
        winner ? `<a href="#drivers/${winner?.driverId}">${winner?.name} ${winner?.surname}</a>` : 'N/A',
        teamWinner ? `<a href="#teams/${teamWinner?.teamId}">${teamWinner?.teamName}</a>` : 'N/A',
        new Date(schedule.race.date as string).toLocaleDateString('en-GB')
      ];
      flexTable.appendChild(getFlexTableRow(content, i));
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
        {Time: race.schedule.race.time?.split(':00Z')[0] ?? 'N/A'},
        { Laps: race.laps },
        { Winner: winnerHTML },
        { 'Team winner': teamWinnerHTML },
      ];
      appendListItems(details, allLi);
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
      const uiData = await this._populateContent();
      document.getElementById('races-title')!.innerHTML = uiData.title;
      document.getElementById('races-desc')!.innerHTML = uiData.desc;
      document.getElementById('races')!.appendChild(uiData.elem);
    } catch (error) {
      setErrorMsg('races', error);
    }
    document.getElementById('overlay')!.classList.toggle('hidden');
    console.log(`[Races] - Races page loaded: ${this._param}`);
  }

  public getHTML(): string {
    return `
      <h1 id="races-title"></h1>
      <div id="races-desc"></div>
      <div id="races"></div>
    `;
  }
}
