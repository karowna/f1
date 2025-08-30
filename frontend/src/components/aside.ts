class Aside {
  constructor() {
    this._populateLinks();
    this._populateSocials();
    console.log('[Aside] - Initialised Aside class');
  }
  
  private _populateLinks(): void {
    const links = [
      { name: 'F1 Official', url: 'https://www.formula1.com/' },
      { name: 'F1 Sky', url: 'https://www.skysports.com/f1' },
      { name: 'F1 BBC', url: 'https://www.bbc.co.uk/sport/formula1' },
      { name: 'F1 Academy', url: 'https://www.f1academy.com/' },
      // { name: 'F1 WikiPedia', url: 'https://en.wikipedia.org/wiki/Formula_One' },
    ];
    
    document.getElementById('links')!.innerHTML = `
      <h3>Useful Links</h3>
      <div>
        ${links.map(link => `<a href="${link.url}" target="_blank">${link.name}</a>`).join('')}
      </div>
    `;
  }

  private _populateSocials(): void {
    const social = [
      { name: 'X', url: 'https://x.com/f1', icon: './assets/x.png' },
      { name: 'Instagram', url: 'https://www.instagram.com/f1/', icon: './assets/instagram.png' },
      { name: 'YouTube', url: 'https://www.youtube.com/f1', icon: './assets/youtube.png' },
    ];

    document.getElementById('socials')!.innerHTML = `
      <h3>F1 Socials</h3>
      <div>
        ${social.map(s => `<a href="${s.url}" target="_blank"><img src="${s.icon}" alt="${s.name}"></a>`).join('')}
      </div>
    `;
  }
}

export const aside = new Aside();
