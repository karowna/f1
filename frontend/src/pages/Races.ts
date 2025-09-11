import { Comment, DriverTeamRaceContent, PageClass, Races as IRaces } from '../types';
import { appendListItems, fetchData, handleRaceNames, getFlexTable, getFlexTableRow, setErrorMsg } from '../utils';

export class Races implements PageClass {
  private readonly _param: string;
  private _data: IRaces | null = null;

  constructor(param: string) {
    this._param = param;
    console.log('[Races] - Initialised Races class');
  }

  private _populateRacesTable(): DriverTeamRaceContent {
    const title = `All ${this._data?.total} races of the ${this._data?.season} season`;
    const flexTable = getFlexTable(['Race', 'Winner', 'Team', 'Date']);
    this._data?.races.forEach((r, i) => {
      const { raceId, raceName, winner, teamWinner, schedule } = r;
      const content = [
        `<a href="#races/${raceId}">${handleRaceNames(raceName)}</a>`,
        winner ? `<a href="#drivers/${winner?.driverId}">${winner?.name} ${winner?.surname}</a>` : 'N/A',
        teamWinner ? `<a href="#teams/${teamWinner?.teamId}">${teamWinner?.teamName}</a>` : 'N/A',
        new Date(schedule.race.date as string).toLocaleDateString('en-GB'),
      ];
      flexTable.appendChild(getFlexTableRow(content, i));
    });
    return { title, desc: '', elem: flexTable };
  }

  private _getTextarea(id: string): HTMLElement {
    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.rows = 4;
    textarea.maxLength = 500;
    textarea.placeholder = 'Write your comment here... (max 500 characters)';
    return textarea;
  }

  private _getBtn(id: string, text: string): Element {
    const btn = document.createElement('button');
    btn.id = id;
    btn.innerText = text;
    return btn;
  }

  private _getSpan(text: string, className: string, title: string): Element {
    const span = document.createElement('span');
    span.innerText = text;
    span.className = className;
    span.title = title;
    return span;
  }

  private _getDialog(): HTMLDialogElement {
    const dialog = document.createElement('dialog');
    dialog.id = 'modal';
    const dialogTitle = document.createElement('h2');
    dialogTitle.innerText = 'Edit Comment';
    dialog.appendChild(dialogTitle);
    dialog.appendChild(this._getTextarea('modal-input'));
    return dialog;
  }

  private async _updateContent(): Promise<void> {
    document.getElementById('race-container')!.remove();
    const content = await this._populateRace();
    document.getElementById('races-desc')!.innerHTML = content.desc;
    await this.loaded();
  }

  private _populateCommentTextArea(commentSection: HTMLElement): void {
    const form = document.createElement('form');
    form.id = 'comment-form';
    commentSection.appendChild(form);
    commentSection.appendChild(this._getTextarea('comment-input'));
    const button = this._getBtn('submit', 'Submit');
    button.addEventListener('click', async () => {
      const content = (document.getElementById('comment-input') as HTMLTextAreaElement).value;
      if (!content) return;
      await fetchData.post(`/comments/${this._param}`, { content, userId: fetchData.userId }, fetchData.loggedIn);
      await this._updateContent();
    });
    commentSection.appendChild(button);
  }

  private _populateComments(container: HTMLElement, comments: Comment[]): void {
    const commentSection = document.createElement('section');
    commentSection.id = 'comments-section';
    const h2 = document.createElement('h2');
    h2.innerHTML = fetchData.loggedIn ? 'Leave a comment' : '<a href="#auth/login">Log in</a> to leave a comment';
    commentSection.appendChild(h2);

    const dialog = this._getDialog();
    const submitButton = this._getBtn('modal-submit', 'Submit');
    dialog.appendChild(submitButton);
    container.appendChild(dialog);
    const closeButton = this._getBtn('close', 'Close');
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
        const editMsg = this._getSpan('✏️', 'edit-comment', 'Edit comment');
        editMsg.addEventListener('click', async () => {
          const modal = document.getElementById('modal')! as HTMLDialogElement;
          modal.showModal();
          const ta = document.getElementById('modal-input')! as HTMLTextAreaElement;
          ta.value = document.getElementById(div.id)?.innerHTML.replace(/<p.*/, '') ?? '';
          submitButton.addEventListener('click', async () => {
            const content = (document.getElementById('modal-input') as HTMLTextAreaElement).value;
            if (!content) return;
            await fetchData.put(`/comments/${this._param}`, { content, userId: fetchData.userId, id: div.id }, fetchData.loggedIn);
            await this._updateContent();
          });
        });
        p.appendChild(editMsg);
        const deleteMsg = this._getSpan('🗑️', 'delete-comment', 'Delete comment');

        deleteMsg.addEventListener('click', async () => {
          await fetchData.delete(`/comments/${this._param}/${div.id}`, fetchData.loggedIn);
          await this._updateContent();
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

  private async _populateRace(): Promise<DriverTeamRaceContent> {
    const comments = await fetchData.get<Comment[]>(`/comments/${this._param}`, fetchData.loggedIn, false);
    const race = this._data?.races.find((r) => r.raceId === this._param);
    if (race) {
      const container = document.createElement('div');
      container.id = 'race-container';
      const details = document.createElement('ul');
      details.id = 'race-details';
      const winnerHTML = race.winner ? `<a href="#drivers/${race.winner?.driverId}">${race.winner?.name} ${race.winner?.surname}</a>` : 'N/A';
      const teamWinnerHTML = race.teamWinner ? `<a href="#teams/${race.teamWinner?.teamId}">${race.teamWinner?.teamName}</a>` : 'N/A';
      const allLi = [
        { Date: race.schedule.race.date },
        { Time: race.schedule.race.time?.split(':00Z')[0] ?? 'N/A' },
        { Laps: race.laps },
        { Winner: winnerHTML },
        { 'Team winner': teamWinnerHTML },
      ];
      appendListItems(details, allLi);
      container.append(details);
      const video = document.createElement('video');
      container.append(video);
      video.controls = true;
      video.innerHTML = `<source src="${this._data?.video}" type="video/mp4">`;
      this._populateComments(container, comments);
      const title = handleRaceNames(race.raceName);
      return { title, desc: '', elem: container };
    }
    return { title: 'Race Not Found', desc: '', elem: document.createElement('div') };
  }

  private async _populateContent(): Promise<DriverTeamRaceContent> {
    this._data = await fetchData.get('/races', fetchData.loggedIn, true);
    return this._param ? this._populateRace() : this._populateRacesTable();
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
