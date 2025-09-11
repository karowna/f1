import {Comment, DriverTeamRaceContent, PageClass, Races as IRaces} from '../types';
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
  
  private _getTextarea(id: string): HTMLElement {
    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.rows = 4;
    textarea.maxLength = 500;
    textarea.placeholder = 'Write your comment here... (max 500 characters)';
    return textarea;
  }
  
  private _populateCommentTextArea(commentSection: HTMLElement): void {
    const form = document.createElement('form');
    form.id = 'comment-form';
    commentSection.appendChild(form);
    commentSection.appendChild(this._getTextarea('comment-input'));
    const button = document.createElement('button');
    button.addEventListener('click', async (e) => {
      const content = (document.getElementById('comment-input') as HTMLTextAreaElement).value;
      if (!content) return;
      await fetchData.post(`/comments/${this._param}`, {content, userId: fetchData.userId}, fetchData.loggedIn);
      window.location.reload();
    });
    button.innerText = 'Submit';
    commentSection.appendChild(button);
  }
  
  private _populateComments(container: HTMLElement, comments: Comment[]): void {
    const commentSection = document.createElement('section');
    commentSection.id = 'comments-section';
    const h2 = document.createElement('h2');
    h2.innerHTML = fetchData.loggedIn ? 'Leave a comment' : 'Log in to leave a comment';
    commentSection.appendChild(h2);
    const dialog = document.createElement('dialog');
    dialog.id = 'modal';
    const dialogTitle = document.createElement('h2');
    dialogTitle.innerText = 'Edit Comment';
    dialog.appendChild(dialogTitle);
    // const dialogInput = document.createElement('textarea');
    // dialogInput.id = 'modal-input';
    // dialogInput.rows = 4;
    // dialogInput.maxLength = 500;
    dialog.appendChild(this._getTextarea('modal-input'));
    const submitButton = document.createElement('button');
    submitButton.id = 'modal-submit';
    submitButton.innerText = 'Submit';
    dialog.appendChild(submitButton);
    container.appendChild(dialog);
    const closeButton = document.createElement('button');
    closeButton.id = 'close';
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => dialog.close());
    dialog.appendChild(closeButton);
    comments.forEach((c) => {
      const div = document.createElement('div');
      div.id = c.id;
      div.dataset.id = c.userId;
      let content = c.content;
      content += `<p class="timestamp">${new Date(c.timestamp).toLocaleString()}</p>`;
      div.innerHTML = content;
      if (fetchData.userId === c.userId) {
        div.className = 'own-comment';
        const p = document.createElement('p');
        const editMsg = document.createElement('span');
        editMsg.innerText = '✏️';
        editMsg.className = 'edit-comment';
        editMsg.title = 'Edit comment';
        editMsg.addEventListener('click', async (e) => {
          const modal = document.getElementById("modal")! as HTMLDialogElement;
          modal.showModal();
          const ta = document.getElementById('modal-input')! as HTMLTextAreaElement;
          ta.value = document.getElementById(div.id)?.innerHTML.replace(/<p.*/, '') ?? '';
          submitButton.addEventListener('click', async () => {
            const content = (document.getElementById('modal-input') as HTMLTextAreaElement).value;
            if (!content) return;
            await fetchData.put(`/comments/${this._param}`, {content, userId: fetchData.userId, id: div.id}, fetchData.loggedIn);
            window.location.reload();
          });
        });
        p.appendChild(editMsg);
        const deleteMsg = document.createElement('span');
        deleteMsg.innerText = '🗑️';
        deleteMsg.className = 'delete-comment';
        deleteMsg.title = 'Delete comment';
        deleteMsg.addEventListener('click', async (e) => {
          await fetchData.delete(`/comments/${this._param}/${div.id}`, fetchData.loggedIn);
          window.location.reload();
        });
        p.appendChild(deleteMsg);
        div.appendChild(p);
      } else {
        div.className = 'comment';
      }
      commentSection.appendChild(div);
    });
    if (fetchData.loggedIn) {
      this._populateCommentTextArea(commentSection);
    }
    container.appendChild(commentSection);
  }
  
  private async _populateRace(data: IRaces): Promise<DriverTeamRaceContent> {
    const comments = await fetchData.get<Comment[]>(`/comments/${this._param}`, fetchData.loggedIn, false);
    const race = data.races.find((r) => r.raceId === this._param);
    if (race) {
      const container = document.createElement('div');
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
      container.append(details);
      this._populateComments(container, comments);
      // const commentSection = document.createElement('section');
      // commentSection.id = 'comments-section';
      // const h2 = document.createElement('h2');
      // h2.innerHTML = fetchData.loggedIn ? 'Leave a comment' : 'Log in to leave a comment';
      // commentSection.appendChild(h2);
      // const dialog = document.createElement('dialog');
      // dialog.id = 'modal';
      // const dialogTitle = document.createElement('h2');
      // dialogTitle.innerText = 'Edit Comment';
      // dialog.appendChild(dialogTitle);
      // const dialogInput = document.createElement('textarea');
      // dialogInput.id = 'modal-input';
      // dialogInput.rows = 4;
      // dialogInput.maxLength = 500;
      // dialogInput.placeholder = 'Edit your comment here... (max 500 characters)';
      // dialog.appendChild(dialogInput);
      // const submitButton = document.createElement('button');
      // submitButton.id = 'modal-submit';
      // submitButton.innerText = 'Submit';
      // dialog.appendChild(submitButton);
      // container.appendChild(dialog);
      // const closeButton = document.createElement('button');
      // closeButton.id = 'close';
      // closeButton.innerText = 'Close';
      // closeButton.addEventListener('click', () => dialog.close());
      // dialog.appendChild(closeButton);
      // comments.forEach((c) => {
      //   const div = document.createElement('div');
      //   div.id = c.id;
      //   div.dataset.id = c.userId;
      //   let content = c.content;
      //   content += `<p class="timestamp">${new Date(c.timestamp).toLocaleString()}</p>`;
      //   div.innerHTML = content;
      //   if (fetchData.userId === c.userId) {
      //     div.className = 'own-comment';
      //     const p = document.createElement('p');
      //     const editMsg = document.createElement('span');
      //     editMsg.innerText = '✏️';
      //     editMsg.className = 'edit-comment';
      //     editMsg.title = 'Edit comment';
      //     editMsg.addEventListener('click', async (e) => {
      //       const modal = document.getElementById("modal")! as HTMLDialogElement;
      //       modal.showModal();
      //       const ta = document.getElementById('modal-input')! as HTMLTextAreaElement;
      //       ta.value = document.getElementById(div.id)?.innerHTML.replace(/<p.*/, '') ?? '';
      //       submitButton.addEventListener('click', async () => {
      //         const content = (document.getElementById('modal-input') as HTMLTextAreaElement).value;
      //         if (!content) return;
      //         await fetchData.put(`/comments/${this._param}`, {content, userId: fetchData.userId, id: div.id}, fetchData.loggedIn);
      //         window.location.reload();
      //       });
      //     });
      //     p.appendChild(editMsg);
      //     const deleteMsg = document.createElement('span');
      //     deleteMsg.innerText = '🗑️';
      //     deleteMsg.className = 'delete-comment';
      //     deleteMsg.title = 'Delete comment';
      //     deleteMsg.addEventListener('click', async (e) => {
      //       await fetchData.delete(`/comments/${this._param}/${div.id}`, fetchData.loggedIn);
      //       window.location.reload();
      //     });
      //     p.appendChild(deleteMsg);
      //     div.appendChild(p);
      //   } else {
      //     div.className = 'comment';
      //   }
      //   commentSection.appendChild(div);
      // });
      // if (fetchData.loggedIn) {
      //   const form = document.createElement('form');
      //   form.id = 'comment-form';
      //   commentSection.appendChild(form);
      //   const textarea = document.createElement('textarea');
      //   textarea.id = 'comment-input';
      //   textarea.rows = 4;
      //   textarea.maxLength = 500;
      //   textarea.placeholder = 'Write your comment here... (max 500 characters)';
      //   commentSection.appendChild(textarea);
      //   const button = document.createElement('button');
      //   button.addEventListener('click', async (e) => {
      //     const content = (document.getElementById('comment-input') as HTMLTextAreaElement).value;
      //     if (!content) return;
      //     await fetchData.post(`/comments/${this._param}`, {content, userId: fetchData.userId}, fetchData.loggedIn);
      //     window.location.reload();
      //   });
      //   button.innerText = 'Submit';
      //   commentSection.appendChild(button);
      // }
      // container.appendChild(commentSection);
      const title = handleRaceNames(race.raceName);
      return {title, desc: '', elem: container}
    }
    return {title: 'Race Not Found', desc: '', elem: document.createElement('div')}
  }

  private async _populateContent(): Promise<DriverTeamRaceContent> {
    const data: IRaces = await fetchData.get('/races', fetchData.loggedIn, true);
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
