import {vi, describe, expect, it} from "vitest";
import {fetchData} from "../../src/utils"

describe("fetchData tests", () => {
  it("should return data when GET fetch is successful", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;

    // Act
    const result = await fetchData.get("/my-path", false, true);
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/my-path");
    expect(mockFetch.mock.calls[0][1]).toStrictEqual({
      method: "GET",
      headers: new Headers({"Content-Type": "application/json"}),
    });

    // act
    await fetchData.get("/my-path", false, true); // should hit the cache
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // act
    const result2 = await fetchData.get("/my-path/hello", true);
    
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result2).toEqual(mockResponse);
    expect(mockFetch.mock.calls[1][0]).toBe("http://localhost:3000/my-path/hello");
    expect(mockFetch.mock.calls[1][1]).toStrictEqual({
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchData.token}`,
      }),
    });
  });

  it("should throw error when fetch fails", async () => {
    // Arrange
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    // Act & Assert
    await expect(fetchData.get("https://api.example.com/data")).rejects.toThrow("HTTP error! status: 404");
  });

  it("should return data when POST fetch is successful", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;

    // Act
    const result = await fetchData.post("/my-path", {my: 'data'}, true);
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/my-path");
    expect(mockFetch.mock.calls[0][1]).toStrictEqual({
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchData.token}`,
      }),
      body: JSON.stringify({my: 'data'}),
    });
  });

  it("should return data when PUT fetch is successful", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;

    // Act
    const result = await fetchData.put("/my-path", {my: 'data2'}, true);
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/my-path");
    expect(mockFetch.mock.calls[0][1]).toStrictEqual({
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchData.token}`,
      }),
      body: JSON.stringify({my: 'data2'}),
    });
  });

  it("should return data when DELETE fetch is successful", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;

    // Act
    const result = await fetchData.delete("/my-path/driver", true);
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/my-path/driver");
    expect(mockFetch.mock.calls[0][1]).toStrictEqual({
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchData.token}`,
      }),
    });
  });
});