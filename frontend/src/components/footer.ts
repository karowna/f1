function _getPreferredTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function date(): void {
  const year = new Date().getFullYear();
  const footer = document.getElementsByTagName('footer')[0];
  const rights = footer.getElementsByTagName('p')[0]
  rights.innerHTML = `&copy; ${year} ${rights.innerHTML}`;
}

export function theme(): void {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme') ?? '';
  if (['light', 'dark'].includes(savedTheme)) root.setAttribute('data-theme', savedTheme);
  
  document.getElementById('theme-toggle')!.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || _getPreferredTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
