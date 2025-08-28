import { Home, Auth, NotFound, Races, Drivers} from "../pages";

const routes = [
  { path: 'home', page: Home },
  { path: 'auth', page: Auth },
  { path: 'races', page: Races },
  { path: 'drivers', page: Drivers },
  { path: 'not-found', page: NotFound },
];

function _matchRoute(path: string): (param: string) => string {
  return routes.find(r => r.path === path)?.page ?? NotFound;
}

export function getPath(): { path: string; param: string | undefined } {
  if (!location.pathname.endsWith('index.html')) location.pathname = `${location.pathname}index.html`;
  if (!location.hash) location.hash = '#home';
  const [path, param] = location.hash.replace('#', '').split('/');
  return { path, param};
}

function _setActiveLinks(path: string): void {
  document.querySelectorAll('nav a').forEach(a => {
    const route = a.getAttribute('href');
    a.classList.toggle('active', route === `#${path}`); // Adjust based on your routing scheme
  });
}

export function render(): void {
  const { path, param } = getPath();
  const page = _matchRoute(path);
  document.getElementById('app')!.innerHTML = page(param ?? '');
  _setActiveLinks(path);
}

export function navigateTo(path: string): void {
  location.hash = `#${path}`;
}