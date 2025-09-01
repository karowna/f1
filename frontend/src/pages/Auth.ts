import { PageClass } from '../types';

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
  
  private _validateInputs(): void {
    const inputs = Array.from(document.getElementsByTagName('input'));
    const invalidInput = inputs.find((input) => !input.validity.valid);
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
    }
    const password1 = document.getElementById('password-1') as HTMLInputElement;
    const password2 = document.getElementById('password-2') as HTMLInputElement;
    if (!errorMsg && password2 && password1.value !== password2.value) errorMsg = 'Passwords do not match';
    document.getElementById('auth-error')!.innerHTML = errorMsg || '&nbsp;';

    // TODO: submit to backend
    console.log('>>>>', errorMsg || 'All inputs valid');
  }
  
  public loaded(): void {
    document.getElementById('submit')?.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      this._validateInputs();
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
          <button id="submit">${formType}</button>
        </form>
        <p>${msgText}</p>
      </section>
    `;
  }
}
