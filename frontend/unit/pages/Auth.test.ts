import {vi, describe, expect, it } from "vitest";
import {Auth} from "../../src/pages"

describe("Auth Page tests", () => {
  it("should render login form", () => {
    // Arrange
    const auth = new Auth('');
    // Act
    const content = auth.getHTML();

    // Assert
    expect(content).toContain(`<section id="auth">
        <h1 id="auth-title">Log in</h1>
        <form>
          <p id="auth-error">&nbsp;</p>
          
      <input type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$" required />
      <br>
      <input type="password" id="password-1" placeholder="Password" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
    <br>
          <button id="submit">Log in</button>
        </form>
        <p id="auth-msg">Don’t have an account yet? <a href="#auth/signup">Sign up.</a></p>
      </section>`);
  });

  it("should render signup form", async () => {
    // Arrange
    const auth = new Auth('signup');
    // Act
    const content = auth.getHTML();

    // Assert
    expect(content).toContain(`<section id="auth">
        <h1 id="auth-title">Sign up</h1>
        <form>
          <p id="auth-error">&nbsp;</p>
          
      
      <input type="text" id="email" placeholder="Email" pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$" required />
      <br>
      <input type="password" id="password-1" placeholder="Password" pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required />
    
      <br>
      <input type="password" id="password-2" placeholder="Re-enter password" required />
    <br>
          <button id="submit">Sign up</button>
        </form>
        <p id="auth-msg">Already have an account? <a href="#auth/login">Log in.</a></p>
      </section>`);
  });

  it("should render logout button", async () => {
    // Arrange
    const auth = new Auth('logout');
    // Act
    const content = auth.getHTML();

    // Assert
    expect(content).toContain(`<section id="auth">
        <h1 id="auth-title">Log out</h1>
        <form>
          <p id="auth-error">&nbsp;</p>
          <br>
          <button id="submit">Log out</button>
        </form>
        <p id="auth-msg"></p>
      </section>`);
  });
  
  it('should validate inputs correctly', () => {
    // Arrange
    let auth = new Auth('');
    document.body.innerHTML = auth.getHTML();
    
    // Act & Assert
    // Invalid email
    (document.getElementById('email') as HTMLInputElement).value = 'invalid-email';
    (document.getElementById('password-1') as HTMLInputElement).value = 'ValidPass1';
    let result = (auth as any)._validateInputs();
    expect(result.valid).toBe(false);
    expect(document.getElementById('auth-error')!.innerHTML).toBe('Please enter a valid email address');
    
    // Valid email, invalid password
    (document.getElementById('email') as HTMLInputElement).value = 'test@email.com';
    (document.getElementById('password-1') as HTMLInputElement).value = 'invalidpass1';
    result = (auth as any)._validateInputs();
    expect(result.valid).toBe(false);
    expect(document.getElementById('auth-error')!.innerHTML).toBe('Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number');

    // Valid email, valid password
    (document.getElementById('email') as HTMLInputElement).value = 'test@email.com';
    (document.getElementById('password-1') as HTMLInputElement).value = 'ValidPass1';
    result = (auth as any)._validateInputs();
    expect(result.valid).toBe(true);
    expect(document.getElementById('auth-error')!.innerHTML).toBe('&nbsp;');

    // Arrange
    auth = new Auth('signup');
    document.body.innerHTML = auth.getHTML();
    
    // Act & Assert
    // Passwords do not match
    // Valid email, valid password
    (document.getElementById('email') as HTMLInputElement).value = 'test@email.com';
    (document.getElementById('password-1') as HTMLInputElement).value = 'ValidPass1';
    (document.getElementById('password-1') as HTMLInputElement).value = 'VValidPass12';
    result = (auth as any)._validateInputs();
    expect(result.valid).toBe(false);
    expect(document.getElementById('auth-error')!.innerHTML).toBe('Passwords do not match');
  });
  
  it('should handle action correctly', () => {
    // Arrange
    const auth = new Auth('logout');
    document.body.innerHTML = auth.getHTML();
    const navbar = document.createElement('div');
    navbar.id = 'navbar';
    navbar.innerHTML = `<nav>
      <a href="#home">Home</a>
      <a href="#explore">Explore</a>
      <a href="#profile">Profile</a>
      <a href="#settings">Settings</a>
      <a href="#auth/login">Login/Signup</a>
    </nav>`;
    document.body.appendChild(navbar);
    
    // Act
    (auth as any)._handleAction('Logout', '#auth/logout', 'Logged out', 'See you again soon!', null);
    
    // Assert
    const authLink = document.getElementById('navbar')!.getElementsByTagName('nav')[0].children[4] as HTMLAnchorElement;
    expect(authLink.innerHTML).toBe('Logout');
    expect(authLink.href).toContain('#auth/logout');
    expect(document.getElementById('auth-title')!.innerHTML).toBe('Logged out');
    expect(document.getElementById('auth-msg')!.innerHTML).toBe('See you again soon!');
  });
  
  it('should handle submit correctly', async () => {
    // Arrange
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({}),
      ok: true,
      status: 200,
    });
    globalThis.fetch = mockFetch;
    let auth = new Auth('login');
    const nav = `<div id="navbar"><nav>
      <a href="#home">Home</a>
      <a href="#explore">Explore</a>
      <a href="#profile">Profile</a>
      <a href="#settings">Settings</a>
      <a href="#auth/login">Login/Signup</a>
    </nav></div>`;
    document.body.innerHTML = '<div id="overlay" class="hidden"></div>' + nav + auth.getHTML();
    // Valid email, valid password
    (document.getElementById('email') as HTMLInputElement).value = 'test@email.com';
    (document.getElementById('password-1') as HTMLInputElement).value = 'ValidPass1';
    auth.loaded();
    
    // Act
    document.getElementById('submit').click();
    await new Promise(process.nextTick);
    
    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toBe("http://localhost:3000/auth/login");
    expect(mockFetch.mock.calls[0][1].body).toStrictEqual(JSON.stringify({ email: 'test@email.com', password: 'ValidPass1' }));
  });
});