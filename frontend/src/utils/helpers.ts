import { PageName } from '../enums';

import { fetchData } from './fetchData';

async function _setFavourite(type: 'driver' | 'team', id: string): Promise<void> {
  try {
    document.getElementById('overlay')!.classList.toggle('hidden');
    const favSpan = document.getElementById('favourite-span')!;
    const text = document.getElementById('favourite-text')!.getElementsByTagName('span')[0];
    const isFavourite = !favSpan.className;
    await fetchData.post(`/favourites/${type}/${id}/${fetchData.userId}`, { favourite: isFavourite }, true);
    favSpan.classList.toggle('favourite');
    text.innerHTML = isFavourite ? `One of your favourite ${type}s ` : `Click to set as favourite ${type} `;
  } catch (error) {
    console.error(`[setFavourite] - Error toggling favourite for ${type} ID ${id}:`, error);
    const parent = document.getElementById(`${type}s`)!;
    parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
    parent.style.textAlign = 'center';
  }
  document.getElementById('overlay')!.classList.toggle('hidden');
}

export async function handleCustomContent(parentElem: HTMLElement, type: 'driver' | 'team', id: string): Promise<void> {
  if (fetchData.loggedIn) {
    const { favourite } = await fetchData.get<{ favourite: boolean }>(`/favourites/${type}/${id}/${fetchData.userId}`, fetchData.loggedIn);
    const favouriteP = document.createElement('p');
    favouriteP.id = 'favourite-text';
    favouriteP.innerHTML = `<span>${favourite ? 'One of your favourite teams ' : 'Click to set as favourite team '}</span>`;
    const favouriteSpan = document.createElement('span');
    favouriteSpan.id = 'favourite-span';
    favouriteSpan.innerHTML = '&nbsp;&#10084;';
    favouriteSpan.className = favourite ? 'favourite' : '';
    favouriteP.addEventListener('click', () => _setFavourite(type, id));
    favouriteP.appendChild(favouriteSpan);
    parentElem.appendChild(favouriteP);
  } else {
    const loginPrompt = document.createElement('p');
    loginPrompt.innerHTML = `<a href="#${PageName.AUTH}">Log in</a> for more...`;
    parentElem.appendChild(loginPrompt);
  }
}

export function handleRaceNames(name: string): string {
  if (name.includes('Italy')) {
    [name] = name.split(' e ');
  }
  return name.replace('2025', '');
}

export function appendListItems(parent: HTMLElement, allLi: {}[]): void {
  allLi.forEach((element) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${Object.keys(element)[0]}:</span> ${Object.values(element)[0]}`;
    parent.appendChild(li);
  });
}

export function getFlexTable(headings: string[]): HTMLElement {
  const flexTable = document.createElement('div');
  flexTable.id = 'flex-table';
  flexTable.role = 'table';
  const raceRowHeader = document.createElement('div');
  raceRowHeader.className = 'flex-row header';
  raceRowHeader.role = 'row';
  raceRowHeader.innerHTML = headings.map((h) => `<div role="columnheader" class="flex-cell">${h}</div>`).join('');
  flexTable.appendChild(raceRowHeader);
  return flexTable;
}

export function getFlexTableRow(content: string[], index: number): HTMLElement {
  const raceRow = document.createElement('div');
  raceRow.className = 'flex-row';
  raceRow.role = 'row';
  index % 2 === 0 && raceRow.classList.add('alt');
  raceRow.innerHTML = content.map((c) => `<div role="cell" class="flex-cell">${c}</div>`).join('');
  return raceRow;
}

export function setErrorMsg(elemName: string, error: unknown): void {
  const parent = document.getElementById(elemName)!;
  parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
  parent.style.textAlign = 'center';
  console.error(`[${elemName[0].toUpperCase()}${elemName.slice(1)}] - Error loading ${elemName} data: ${error}`);
}
