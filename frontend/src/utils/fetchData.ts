import { HTTPMethod } from '../enums';

class FetchData {
  private _token: string | null = null;
  private _userId: string | null = null;
  private _cache: { [key:string]: { data: unknown, expiry: number} } = {};
  
  private _sendRequest(method: HTTPMethod, path: string, useToken: boolean, data: unknown): Promise<Response> {
    console.log(`Sending ${method} request to ${path} with token: ${useToken} and data:`, data);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    useToken && headers.append('Authorization', `Bearer ${this._token}`);
    const options: { method: HTTPMethod; headers: Headers; body?: string } = { method, headers};
    data && (options.body = JSON.stringify(data));
    console.log('Request options:', options);
    // return fetch(`https://hnxfgutvgswxxvzctxto.supabase.co/functions/v1${path}`, options);
    return fetch(`http://localhost:3000${path}`, options);
  }
  
  public set token(token: string | null) {
    this._token = token;
  }
  
  public get token(): string | null {
    return this._token;
  }

  public set userId(userId: string | null) {
    this._userId = userId;
  }

  public get userId(): string | null {
    return this._userId;
  }
  
  public get loggedIn(): boolean {
    return !!this._token;
  }
  
  public async get<T>(path: string, loggedIn = false, cache = false): Promise<T> {
    if (cache) {
      const cached = this._cache[path];
      console.log('cached', cached);
      if (cached && (Date.now() < cached.expiry)) return cached.data as T;
    }
    const response = await this._sendRequest(HTTPMethod.GET, path, loggedIn, null);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (cache) this._cache[path] = { data, expiry: Date.now() + 15 * 60 * 1000 }; // Cache for 15 minutes
    return data;
  }

  public async post<T>(path: string, data: unknown, loggedIn = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.POST, path, loggedIn, data);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  public async put<T>(path: string, data: unknown, loggedIn = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.PUT, path, loggedIn, data);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  public async delete<T>(path: string, loggedIn = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.DELETE, path, loggedIn, null);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}

export const fetchData = new FetchData();
