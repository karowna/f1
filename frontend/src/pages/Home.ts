import { PageClass } from '../types';

export class Home implements PageClass {
  private readonly _param: string;
  private _intervalId: number | null = null;

  constructor(param: string) {
    this._param = param;
  }
  public loaded(): void {
    console.log('[Home] - starting slideshow');
    const slideShowImages = document.getElementById('slide-show');
    let currentIndex = 0;
    const slides = Array.from(slideShowImages?.getElementsByTagName('div') || []);
    if (!slides.length) return;
    const totalSlides = slides.length;

    slides.forEach((slide, i, index) => slide.style.display = i === currentIndex ? 'flex' : 'none');

    this._intervalId = setInterval((): void => {
      console.log('[Home] - changing slide');
      currentIndex = (currentIndex + 1) % totalSlides;
      slides.forEach((slide, i, index) => slide.style.display = i === currentIndex ? 'flex' : 'none');
    }, 3000); // Change slide every 3 seconds
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
      <div id="slide-show">
        <div>
          <img src="./assets/slide-1.jpg" alt="F1 Car 1">
        </div>
        <div>
          <img src="./assets/slide-2.jpg" alt="F1 Car 2">
        </div>
        <div>
          <img src="./assets/slide-3.jpg" alt="F1 Car 3">
        </div>
        <div>
          <img src="./assets/slide-4.jpg" alt="F1 Car 4">
        </div>
      </div>
      <h1>F1 Portal</h1>
      <p>Welcome to the F1 Portal, your ultimate destination for all things Formula 1!</p>
      <p>Stay updated with the latest news!</p>
  `;
  }
}
