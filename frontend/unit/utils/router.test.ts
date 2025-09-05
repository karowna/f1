import {describe, expect, it} from "vitest";
import {router} from "../../src"
import {PageName} from "../../src/enums";

describe("router", () => {
  it("should be instantiated", () => {
    // assert
    expect(router).toBeInstanceOf(Object);
  });
  
  it("should have a navigateTo method", () => {
    // assert
    expect(router.navigateTo).toBeInstanceOf(Function);
  });
  
  it("should navigate to a specific route", () => {
    // act
    router.navigateTo(PageName.HOME);
    
    // assert
    expect(location.hash).toBe('#home');
  });
  
  it("should navigate to not found for an unknown route", () => {
    // act
    router.navigateTo(PageName.HOME);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    // assert
    expect(location.hash).toBe('#home');
    
    // act
    location.hash = '#unknownroute';
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    // assert
    expect(location.hash).toBe('#unknownroute');

    // act
    location.hash = '#access_token=somevalue';
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    // assert
    expect(location.hash).toBe('#auth');
  });
});