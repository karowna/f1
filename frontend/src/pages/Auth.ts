import { PageClass } from '../types';

export class Auth implements PageClass {
  private readonly _param: string;
  
  constructor(param: string) {
    this._param = param;
    console.log(`[Auth] - Initialised Auth class, param: ${this._param}`);
  }
  
  private _populateLogin(): string {
    return `
      <input type="text" id="email" placeholder="Email" required />
      <br>
      <input type="password" id="password" placeholder="Password" required />
    `;
  }

  private _populateSignup(): string {
    return `
      <input type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$" required />
      <br>
      <input type="password" id="password" placeholder="Password" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
      <br>
      <input type="password" id="password-2" placeholder="Re-enter password" required />
    `;
  }
  
  public loaded(): void {
    console.log('Auth page loaded', this._param);
  }

  // public unloaded(): void {
  //   console.log('Auth page loaded', this._param);
  // }
  
  public getHTML(): string {
    let inputs = '';
    let formType = '';
    let msgText = '';
    if (!this._param || this._param === 'login') {
      inputs = this._populateLogin();
      formType = 'Log in';
      msgText = 'Don’t have an account yet? <a href="#auth/signup">Sign up.</a>';
    } else if (this._param === 'signup') {
      inputs = this._populateSignup();
      formType = 'Sign up';
      msgText = 'Already have an account? <a href="#auth/login">Log in.</a>';
    } else if (this._param === 'logout') {
      formType = 'Log out';
    }
    
    return `
      <section id="auth">
        <h1>${formType}</h1>
        <form>
          <p id="auth-error">&nbsp;</p>
          ${inputs}<br>
          <button>${formType}</button>
        </form>
        <p>${msgText}</p>
      </section>
    `;
  }
}
