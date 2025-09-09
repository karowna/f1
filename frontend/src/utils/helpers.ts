import { fetchData } from "./fetchData";
import {PageName} from "../enums";

async function _setFavourite(type: 'driver' | 'team', id: string): Promise<void> {
  try {
    document.getElementById('overlay')!.classList.toggle('hidden');
    const favSpan = document.getElementById('favourite-span')!;
    const text = document.getElementById('favourite-text')!.getElementsByTagName('span')[0];
    const isFavourite = !!favSpan.className;
    await fetchData.post(`/favourites/${type}/${id}`, { favourite: isFavourite }, true);
    favSpan.classList.toggle('favourite');
    text.innerHTML = !isFavourite ? `One of your favourite ${type}s ` : `Click to set as favourite ${type} `;
  } catch (error) {
    console.error(`[setFavourite] - Error toggling favourite for ${type} ID ${id}:`, error);
    const parent = document.getElementById(`${type}s`)!;
    parent.innerHTML = 'Oops! Something went wrong. Please try again later.';
    parent.style.textAlign = 'center';
  }
  document.getElementById('overlay')!.classList.toggle('hidden');
}

export function handleCustomContent(parentElem: HTMLElement, type: 'driver' | 'team', id: string): void {
  if (fetchData.token) {
    const favouriteP = document.createElement('p');
    const fav = true; // TODO: Placeholder for actual favourite check
    favouriteP.id = 'favourite-text';
    favouriteP.innerHTML = `<span>${fav ? 'One of your favourite teams ' : 'Click to set as favourite team '}</span>`;
    const favouriteSpan = document.createElement('span');
    favouriteSpan.id = 'favourite-span';
    favouriteSpan.innerHTML = '&nbsp;&#10084;';
    favouriteSpan.className = fav ? 'favourite' : '';
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