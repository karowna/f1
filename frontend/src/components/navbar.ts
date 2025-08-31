import { PageName } from '../enums';

class Navbar {
  private readonly _burger = document.getElementById('burger-menu')!;
  private readonly _nav = document.getElementsByTagName('nav')[0];
  constructor() {
    this._populateNavLinks();
    this._burgerMenuClick();
    console.log('[Navbar] - Initialised Navbar class');
  }

  private _populateNavLinks() {
    Object.values(PageName).forEach((value) => {
      const a = document.createElement('a');
      if (value === PageName.NOT_FOUND) return; // Skip notfound page
      a.href = `#${value}`;
      if (value === PageName.AUTH) {
        a.textContent = 'Login/Signup';
      } else {
        a.textContent = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this._nav.appendChild(a);
    });
  }
  
  private _burgerMenuClick() {
    this._burger.addEventListener('click', () => {
      this._burger.classList.toggle('rotate');
      this._nav.classList.toggle('show');
    });
  }
}

export const navbar = new Navbar();
