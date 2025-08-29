import { Page } from '../types';

let intervalId: number | null = null;

function _slideShow(): void {
  const slideShowImages = document.getElementById('slide-show');
  let currentIndex = 0;
  const slides = slideShowImages?.getElementsByTagName('div');
  if (!slides && slides!.length) return;
  const totalSlides = slides!.length;

  function showSlide(index: number) {
    for (let i = 0; i < totalSlides; i++) {
      (slides![i] as HTMLElement).style.display = i === index ? 'flex' : 'none';
    }
  }

  showSlide(currentIndex);
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }, 3000); // Change slide every 3 seconds
}

function _stopSlideShow(): void {
  console.log(`[Home] - Stopping slideshow ${intervalId}`);
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function Home(): Page {
  return {
    loaded: _slideShow,
    unloaded: _stopSlideShow,
    html: `
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
  `
  }
}
