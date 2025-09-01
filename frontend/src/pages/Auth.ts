import { PageClass } from '../types';
import { fetchData } from "../utils";

export class Auth implements PageClass {
  private readonly _param: string;
  
  constructor(param: string) {
    this._param = param;
    console.log(`[Auth] - Initialised Auth class, param: ${this._param}`);
  }
  
  private _populateLogin(): string {
    return `
      <input type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$" required />
      <br>
      <input type="password" id="password-1" placeholder="Password" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
    `;
  }

  private _populateSignup(): string {
    return `
      ${this._populateLogin()}
      <br>
      <input type="password" id="password-2" placeholder="Re-enter password" required />
    `;
  }
  
  private _validateInputs(): { inputs: HTMLInputElement[]; valid: boolean } {
    const inputs = Array.from(document.getElementsByTagName('input'));
    const invalidInput = inputs.find((input) => !input.validity.valid);
    inputs.forEach((input) => input.className = '');
    let errorMsg = '';
    console.log('Inputs:', invalidInput?.validationMessage);
    if (invalidInput) {
      if (invalidInput.id === 'email') {
        errorMsg = 'Please enter a valid email address';
      } else if (invalidInput.id === 'password-1') {
        errorMsg = invalidInput.value
          ? 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.'
          : 'Please enter a password';
      }
      invalidInput.className = 'error';
    }

    const password1 = document.getElementById('password-1') as HTMLInputElement;
    const password2 = document.getElementById('password-2') as HTMLInputElement;
    if (!errorMsg && password2 && password1.value !== password2.value) {
      errorMsg = 'Passwords do not match';
      password2.className = 'error';
    }
    document.getElementById('auth-error')!.innerHTML = errorMsg || '&nbsp;';
    return { inputs: inputs, valid: !errorMsg };
  }
  
  private async _handleSubmit(): Promise<void> {
    const { inputs, valid } = this._validateInputs();

    // TODO: submit to backend
    console.log('>>>>', valid || 'All inputs valid');
    if (valid) {
      try {
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const password = (document.getElementById('password-1') as HTMLInputElement)?.value;
        const authLink = document.getElementById('navbar')!.getElementsByTagName('nav')[0].children[4] as HTMLAnchorElement;
        if (this._param === 'logout') {
          console.log('Logging out...');
          fetchData.token = null;
          authLink.innerHTML = 'Login/Signup';
          authLink.href = '#auth/login';
          document.getElementsByTagName('form')[0].remove();
          document.getElementById('auth-title')!.innerHTML = 'Logged out';
          document.getElementById('auth-msg')!.innerHTML = 'See you again soon!';
        } else if (this._param === 'signup') {
          console.log('Signing up...');
        } else if (!this._param || this._param === 'login') {
          console.log('Logging in...');
          const loginReq = await fetchData.post<{token: string}>('/auth/login', { email, password });
          fetchData.token = loginReq.token;
          console.log('Token set:', fetchData.token);
          document.getElementById('auth-title')!.innerHTML = 'Logged in';
          document.getElementById('auth-msg')!.innerHTML = 'Want to leave? <a href="#auth/logout">Log out.</a>';
          authLink.innerHTML = email.split('@')[0];
          authLink.href = '#auth/logout';
          document.getElementsByTagName('form')[0].remove();
        }
      } catch (error) {
        console.error(`[Auth] - Error during auth request: ${error}`);
        inputs.forEach((input) => input.value = '');
        document.getElementById('auth-error')!.innerHTML = 'An error occurred. Please try again later.';
      }
    }
  }
  
  public loaded(): void {
    document.getElementById('submit')?.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      this._handleSubmit();
    });
    console.log('Auth page loaded', this._param);
  }

  // public unloaded(): void {
  //   console.log('Auth page loaded', this._param);
  // }
  
  public getHTML(): string {
    let inputs = '';
    let formType = '';
    let msgText = '';
    if (fetchData.token || this._param === 'logout') {
      formType = 'Log out';
    } else if (this._param === 'signup') {
      inputs = this._populateSignup();
      formType = 'Sign up';
      msgText = 'Already have an account? <a href="#auth/login">Log in.</a>';
    } else if (!this._param || this._param === 'login') {
      inputs = this._populateLogin();
      formType = 'Log in';
      msgText = 'Don’t have an account yet? <a href="#auth/signup">Sign up.</a>';
    }
    
    return `
      <section id="auth">
        <h1 id="auth-title">${formType}</h1>
        <form>
          <p id="auth-error">&nbsp;</p>
          ${inputs}<br>
          <button id="submit">${formType}</button>
        </form>
        <p id="auth-msg">${msgText}</p>
      </section>
    `;
  }
}
