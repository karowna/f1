import { it, expect, describe } from "vitest";
import { navbar } from "../../src/components/navbar";

describe("navbar test", () => {
  it("should be instantiated", () => {
    // assert
    expect(navbar).toBeInstanceOf(Object);
  });
  
  it('should have nav links populated', () => {
    // arrange
    const nav = document.getElementsByTagName('nav')[0];
    const links = nav.getElementsByTagName('a');
    // assert
    expect(links.length).toBe(5);
    expect(links[0].textContent).toBe('Home');
    expect(links[1].textContent).toBe('Races');
    expect(links[2].textContent).toBe('Drivers');
    expect(links[3].textContent).toBe('Teams');
    expect(links[4].textContent).toBe('Login/Signup');
  });
  
  it('should toggle classes on burger menu click', () => {
    // arrange
    const burger = document.getElementById('burger-menu')!;
    const nav = document.getElementsByTagName('nav')[0];
    const initialBurgerClass = burger.className;
    const initialNavClass = nav.className;
    // act
    burger.click();
    const toggledBurgerClass = burger.className;
    const toggledNavClass = nav.className;
    // assert
    expect(toggledBurgerClass).not.toBe(initialBurgerClass);
    expect(toggledNavClass).not.toBe(initialNavClass);

    // Clean up by clicking again to reset state
    burger.click();
  });
});