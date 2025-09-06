import {describe, expect, it } from "vitest";
import {Home} from "../../src/pages"

describe("Home Page tests", () => {
  it("should render home page content", () => {
    // Arrange
    const home = new Home('');
    // Act
    const content = home.getHTML();

    // Assert
    expect(content).toContain(`<div id="slide-show"><div><img src="./assets/images/slide-1.jpg" alt="F1 Car 1"></div><div><img src="./assets/images/slide-2.jpg" alt="F1 Car 2"></div><div><img src="./assets/images/slide-3.jpg" alt="F1 Car 3"></div><div><img src="./assets/images/slide-4.jpg" alt="F1 Car 4"></div></div>
      <section id="home-section">
        <h1>F1 Portal</h1>
        <div>
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
    </div>
      </section>`);
  });
});