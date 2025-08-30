import { PageClass } from '../types';
import { PageName } from '../enums';
import { Auth, Drivers, Home, NotFound, Races, Search } from "../pages";

class Router {
  private _livePage: PageClass | null = null;
  private readonly _routes = [
    { path: PageName.HOME, page: Home },
    { path: PageName.AUTH, page: Auth },
    { path: PageName.RACES, page: Races },
    { path: PageName.DRIVERS, page: Drivers },
    { path: PageName.SEARCH, page: Search },
    { path: PageName.NOT_FOUND, page: NotFound },
  ];
  
  constructor() {
    window.addEventListener('hashchange', () => router._render());
    window.addEventListener('DOMContentLoaded', () => router._render());
    console.log('[Router] - Initialised router class');
  }
  
  private _matchRoute(path: PageName): new (param: string) => PageClass {
    return this._routes.find(r => r.path === path)?.page ?? NotFound;
  }
  
  private _getPath(): { path: PageName; param: string | undefined } {
    if (!location.pathname.endsWith('index.html')) location.pathname = `${location.pathname}index.html`;
    if (!location.hash) location.hash = `#${PageName.HOME}`;
    let [path, param] = location.hash.replace('#', '').split('/');
    return { path, param } as { path: PageName; param: string | undefined };
  }
  
  private _setActiveLinks(path: PageName): void {
    document.querySelectorAll('nav a').forEach(a => {
      const route = a.getAttribute('href');
      a.classList.toggle('active', route === `#${path}`);
    });
  }
  
  private _render(): void {
    const { path, param } = this._getPath();
    this._livePage?.unloaded?.();
    this._livePage = new (this._matchRoute(path))(param ?? '');
    document.getElementById('app')!.innerHTML = this._livePage.getHTML();
    this._livePage.loaded?.();
    this._setActiveLinks(path);
  }
  
  public navigateTo(path: PageName): void {
    location.hash = `#${path}`;
  }
}

export const router = new Router();
