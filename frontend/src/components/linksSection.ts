class LinksSection {
  constructor() {
    this._populateLinks();
    this._populateSocials();
    console.log('[LinksSection] - Initialised LinksSection class');
  }
  
  private _populateLinks(): void {
    const links = [
      { name: 'F1 Official', url: 'https://www.formula1.com/' },
      { name: 'F1 Sky', url: 'https://www.skysports.com/f1' },
      { name: 'F1 BBC', url: 'https://www.bbc.co.uk/sport/formula1' },
      { name: 'F1 Academy', url: 'https://www.f1academy.com/' },
    ];
    
    const h3 = document.createElement('h3');
    h3.textContent = 'Useful Links';
    document.getElementById('links')!.appendChild(h3);
    const div = document.createElement('div');
    document.getElementById('links')!.appendChild(div);
    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.textContent = link.name;
      div.appendChild(a);
    });
  }

  private _populateSocials(): void {
    const socials = [
      { name: 'X', url: 'https://x.com/f1', icon: './assets/x.png' },
      { name: 'Instagram', url: 'https://www.instagram.com/f1/', icon: './assets/instagram.png' },
      { name: 'YouTube', url: 'https://www.youtube.com/f1', icon: './assets/youtube.png' },
      { name: 'Facebook', url: 'https://www.facebook.com/Formula1', icon: './assets/facebook.png' },
      { name: 'TikTok', url: 'https://www.tiktok.com/@f1', icon: './assets/tiktok.png' },
    ];

    const h3 = document.createElement('h3');
    h3.textContent = 'F1 Socials';
    document.getElementById('socials')!.appendChild(h3);
    const div = document.createElement('div');
    document.getElementById('socials')!.appendChild(div);
    socials.forEach((social) => {
      const a = document.createElement('a');
      a.href = social.url;
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = social.icon;
      img.alt = social.name;
      a.appendChild(img);
      div.appendChild(a);
    });
  }
}

export const linksSection = new LinksSection();
