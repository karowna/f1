import { Theme } from "../enums";

class Footer {
  constructor() {
    this._setDate();    
    this._setTheme();
    console.log('[Footer] - Initialised Footer class');
  }
  
  private _getPreferredTheme(): Theme {
    return window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches ? Theme.DARK : Theme.LIGHT;
  }
  
  private _setDate(): void {
    const year = new Date().getFullYear();
    const footer = document.getElementsByTagName('footer')[0];
    const rights = footer.getElementsByTagName('p')[0]
    rights.innerHTML = `&copy; ${year} ${rights.innerHTML}`;
  }
  
  private _setTheme(): void {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') ?? '';
    if ([Theme.LIGHT, Theme.DARK].includes(savedTheme as Theme)) root.setAttribute('data-theme', savedTheme);

    document.getElementById('theme-toggle')!.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || this._getPreferredTheme();
      const newTheme = current === Theme.DARK ? Theme.LIGHT : Theme.DARK;
      root.setAttribute('data-theme', newTheme as string);
      localStorage.setItem('theme', newTheme as string);
    });
  }
}

export const footer =  new Footer();
