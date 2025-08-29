import { Page } from '../types';
import { Home, Auth, NotFound, Races, Drivers} from "../pages";

class Router {
  private _routes = [
    { path: 'home', page: Home },
    { path: 'auth', page: Auth },
    { path: 'races', page: Races },
    { path: 'drivers', page: Drivers },
    { path: 'not-found', page: NotFound },
  ];
  constructor() {
    window.addEventListener('hashchange', () => router._render());
    window.addEventListener('DOMContentLoaded', () => router._render());
    console.log('[Router] - Initialised router class');
  }
  
  private _matchRoute(path: string): (param: string) => Page {
    return this._routes.find(r => r.path === path)?.page ?? NotFound;
  }
  
  private _getPath(): { path: string; param: string | undefined } {
    if (!location.pathname.endsWith('index.html')) location.pathname = `${location.pathname}index.html`;
    if (!location.hash) location.hash = '#home';
    const [path, param] = location.hash.replace('#', '').split('/');
    return { path, param};
  }
  
  private _setActiveLinks(path: string): void {
    document.querySelectorAll('nav a').forEach(a => {
      const route = a.getAttribute('href');
      a.classList.toggle('active', route === `#${path}`);
    });
  }
  
  private _render(): void {
    const { path, param } = this._getPath();
    const page = this._matchRoute(path)(param ?? '');
    document.getElementById('app')!.innerHTML = page.html;
    page.loaded();
    this._routes.forEach((r) => r.path !== path && r.page('').unloaded());
    this._setActiveLinks(path);
  }
  
  public navigateTo(path: string): void {
    location.hash = `#${path}`;
  }
}

export const router = new Router();
