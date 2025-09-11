import { PageClass } from '../types';

export class Home implements PageClass {
  private readonly _param: string;
  private readonly _slides: number = 4;
  private _intervalId: number | null = null;

  constructor(param: string) {
    this._param = param;
    console.log(`[Home] - Initialised Home class with ${this._param}`);
  }

  private _populateSlides(): string {
    return Array(this._slides)
      .fill(0)
      .map((_, i) => `<div><img src="./assets/images/slide-${i + 1}.jpg" alt="F1 Car ${i + 1}"></div>`)
      .join('');
  }

  private _populateHome(): string {
    return `
      <p><img id="img-left" src="./assets/images/home-main-left.jpg" alt="f1 car black and white">Step into the fast-paced world of Formula 1. Here you’ll find everything a fan needs, 
      from in-depth driver profiles and team insights to race calendars, circuit details, and 
      the latest results from around the globe.</p>
      <p>Whether you’re a seasoned follower who knows every lap record or a newcomer eager to 
        learn, our site gives you a clear view of the drivers behind the wheel, the iconic 
        tracks they battle on, and the stories that shape each season.<img id="img-right" src="./assets/images/home-main-right.jpg" alt="F1 team"></p>
      <p>Explore the <a href="#drivers">Drivers</a> section to discover your favorites and their 
        stats, or head over to <a href="#races">Races</a> to keep track of upcoming Grands Prix, 
        results, and unforgettable highlights. With Formula 1’s unique mix of speed, precision, 
        and drama, there’s always something new to experience.</p>
      <p>Buckle up, stay informed, and join us as we follow every turn, pit stop, and 
        checkered flag of the F1 season.</p>
    `;
  }

  public loaded(): void {
    console.log('[Home] - starting slideshow');
    const slideShowImages = document.getElementById('slide-show');
    let currentIndex = 0;
    const slides = Array.from(slideShowImages?.getElementsByTagName('div') || []);
    if (!slides.length) return;
    const totalSlides = slides.length;
    slides.forEach((slide, i) => (slide.style.opacity = i === currentIndex ? '1' : '0'));

    this._intervalId = window.setInterval((): void => {
      console.log('[Home] - changing slide');
      currentIndex = (currentIndex + 1) % totalSlides;
      slides.forEach((slide, i) => (slide.style.opacity = i === currentIndex ? '1' : '0'));
    }, 3000);
  }

  public unloaded(): void {
    console.log(`[Home] - Stopping slideshow ${this._intervalId}`);
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  public getHTML(): string {
    return `
      <div id="slide-show">${this._populateSlides()}</div>
      <section id="home-section">
        <h1>F1 Portal</h1>
        <div>${this._populateHome()}</div>
      </section>
  `;
  }
}
