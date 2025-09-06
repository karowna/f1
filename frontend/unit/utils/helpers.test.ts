import {vi, describe, expect, it} from "vitest";
import {fetchData, handleCustomContent} from "../../src/utils"
import {PageName} from "../../src/enums";

describe("handleCustomContent tests", () => {
  it("should set login msg when there is no token", () => {
    // Arrange
    const div = document.createElement("div");
    // Act
    handleCustomContent(div, "driver", "123");
    // Assert
    expect(div.getElementsByTagName('p')[0].innerHTML).toBe(`<a href="#${PageName.AUTH}">Log in</a> for more...`);
  });

  it("should handle favourite message", async () => {
    // Arrange
    const mockResponse = { favourite: true };
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;
    document.body.innerHTML = `<div id="overlay" class="hidden"></div>
        <div id="favourite-span" class="favourite"></div>
        <div id="favourite-text"><span></span></div>
    `;
    const div = document.createElement("div");
    fetchData.token = "123";
    
    // Act
    handleCustomContent(div, "driver", "123");
    const pMsg = div.getElementsByTagName('p')[0];
    
    // Assert
    expect(pMsg.innerHTML).toBe('<span>One of your favourite teams </span><span id="favourite-span" class="favourite">&nbsp;❤</span>');
    
    // Act
    pMsg.click();
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/favourites/driver/123");
    expect(mockFetch.mock.calls[0][1]).toStrictEqual({
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchData.token}`,
      }),
      body: JSON.stringify({ favourite: true }),
    });
    await new Promise(process.nextTick);
    expect(document.getElementById('favourite-text').innerHTML).toBe('<span>Click to set as favourite driver </span>')
  });
});