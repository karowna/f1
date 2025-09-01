import { HTTPMethod } from '../enums';

class Fetch {
  private _token: string | null = null;
  
  private _sendRequest(method: HTTPMethod, path: string, token: boolean, data: unknown): Promise<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    token && headers.append('Authorization', `Bearer ${this._token}`);
    const options: { method: HTTPMethod; headers: Headers; body?: string } = { method, headers};
    data && (options.body = JSON.stringify(data));
    // return fetch(`http://localhost:3000/api${path}`, options);
    return fetch(`https://hnxfgutvgswxxvzctxto.supabase.co/functions/v1${path}`, options);
  }
  
  public set token(token: string | null) {
    this._token = token;
  }
  
  public get token(): string | null {
    return this._token;
  }
  
  public async get<T>(path: string, token = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.GET, path, token, null);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  public async post<T>(path: string, data: unknown, token = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.POST, path, token, data);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  public async put<T>(path: string, data: unknown, token = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.DELETE, path, token, data);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  public async delete<T>(path: string, token = false): Promise<T> {
    const response = await this._sendRequest(HTTPMethod.DELETE, path, token, null);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}

export const fetchData = new Fetch();
