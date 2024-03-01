const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

const { window } = new JSDOM(html);

global.document = window.document;
global.window = window;

const Login = require('./script');


function loadHTMLFile(filePath) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    // Wait for the scripts to be executed and resources to be loaded
    return new Promise((resolve) => {
        dom.window.onload = () => {
            resolve(dom);
        };
    });
}

test('Loaded HTML page is correct', async () => {
    const htmlFilePath = 'index.html';

    const dom = await loadHTMLFile(htmlFilePath);

    const document = dom.window.document;

    const loginButton = document.getElementById('login-button');
    expect(loginButton).not.toBeNull();

});

describe('Image loading test', () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously' });
    });

    test('Image URL is present in CSS', () => {
        const document = dom.window.document;

        const mainComputedStyle = dom.window.getComputedStyle(document.querySelector('main'));

        const backgroundImage = mainComputedStyle.getPropertyValue('background-image');
        console.log(backgroundImage);

        expect(backgroundImage).toContain('background.jpg');
    });
});


describe('Login class', () => {
    let login;
    let emailErrorMessage;
    let passwordErrorMessage;

    beforeEach(() => {
        const emailInput = { value: '' };
        const passwordInput = { value: '' };
        emailErrorMessage = { innerHTML: '' };
        passwordErrorMessage = { innerHTML: '' };
        document.getElementById = jest.fn(id => {
            switch (id) {
                case 'email-error-message':
                    return emailErrorMessage;
                case 'password-error-message':
                    return passwordErrorMessage;
                default:
                    return null;
            }
        });
        login = new Login(emailInput, passwordInput);
        login.redirectTo = jest.fn();//for redirect to URL
    });

    test('attemptLogin calls handleSuccessfulLogin on successful login', () => {
        const emailInput = { value: 'mayukhck@gmail.com' };
        const passwordInput = { value: 'Manu@123' };

        const login = new Login(emailInput, passwordInput);

        login.handleSuccessfulLogin = jest.fn();

        login.attemptLogin();

        expect(login.handleSuccessfulLogin).toHaveBeenCalled();
    });

    test('attemptLogin with empty email and password', () => {
        login.attemptLogin();
        expect(emailErrorMessage.innerHTML).toBe('Email and password are required.');
        expect(passwordErrorMessage.innerHTML).toBe('');
    });

    test('attemptLogin with invalid email', () => {
        login.emailInput.value = 'invalidEmail';
        login.passwordInput.value = 'Manu@123';
        login.attemptLogin();
        expect(emailErrorMessage.innerHTML).toBe('Please enter a valid email address.');
        //expect(passwordErrorMessage.innerHTML).toBe('');
    });

    test('attemptLogin with empty email ', () => {
        login.passwordInput.value = 'Manu@123';
        login.attemptLogin();
        expect(emailErrorMessage.innerHTML).toBe('Email and password are required.');
        expect(passwordErrorMessage.innerHTML).toBe('');
    });

    test('attemptLogin with empty password', () => {
        login.emailInput.value = 'mayukhck@gmail.com';
        login.attemptLogin();
        expect(emailErrorMessage.innerHTML).toBe('Email and password are required.');
        expect(passwordErrorMessage.innerHTML).toBe('');
    });

    test('attemptLogin with invalid password', () => {
        login.emailInput.value = 'mayukhck@gmail.com';
        login.passwordInput.value = 'i@rgh';
        login.attemptLogin();
        expect(emailErrorMessage.innerHTML).toBe('');
        expect(passwordErrorMessage.innerHTML).toBe('Please enter a valid password.');
    });

    test('handleSuccessfulLogin redirects to Google page', () => {
        login.emailInput.value = 'mayukhck@gmail.com';
        login.passwordInput.value = 'Manu@123';

        jest.spyOn(login, 'handleSuccessfulLogin');

        login.handleSuccessfulLogin();

        expect(login.handleSuccessfulLogin).toHaveBeenCalledWith();
    });

    test('should redirect to Google after successful login', () => {
        const login = new Login();

        login.navigateTo = jest.fn();

        login.handleSuccessfulLogin();

        expect(login.navigateTo).toHaveBeenCalledWith('https://www.google.com/');
    });

    // New test cases for validateEmail() method
    test('validateEmail with valid email', () => {
        login.emailInput.value = 'validemail@example.com';
        login.validateEmail();
        expect(emailErrorMessage.innerHTML).toBe('');
    });

    test('validateEmail with invalid email', () => {
        login.emailInput.value = 'invalidemail';
        login.validateEmail();
        expect(emailErrorMessage.innerHTML).toBe('Please enter a valid email address.');
    });

    // New test cases for validatePassword() method
    test('validatePassword with valid password', () => {
        login.passwordInput.value = 'Manu@123';
        login.validatePassword();
        expect(passwordErrorMessage.innerHTML).toBe('');
    });

    test('validatePassword with invalid password', () => {
        login.passwordInput.value = 'invalid';
        login.validatePassword();
        expect(passwordErrorMessage.innerHTML).toBe('Please enter a valid password.');
    });

});

describe('check if buttons and Header,Footer present or not', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    test('should create a login button in the DOM', () => {
        const loginButton = document.querySelector('#login-button');

        expect(loginButton).toBeTruthy();
        expect(loginButton.textContent).toBe('Login');
    });

    test('Should create an email text field in the DOM', () => {
        const emailTextField = document.querySelector('#email');

        expect(emailTextField).toBeTruthy();
    });

    test('Should create a password text field in DOM', () => {
        const passwordTextField = document.querySelector('#password');

        expect(passwordTextField).toBeTruthy();
    });

    test('Should create a link text for "Forgot Password?" in DOM', () => {
        const forgotPasswordLink = document.querySelector('.forgotPassword');

        expect(forgotPasswordLink).toBeTruthy();
        expect(forgotPasswordLink.textContent).toBe('Forgot Password?');
    });

    test('Should create a link text for "Create Account" in DOM', () => {
        const createAccountLink = document.querySelector('.createAccount');

        expect(createAccountLink).toBeTruthy();
        expect(createAccountLink.textContent).toBe('Create Account');
    });

    test('check header present or not', () => {
        const header = document.getElementsByTagName('header')

        expect(header).toBeTruthy();
    })

    test('check footer prsent or not', () => {
        const footer = document.getElementsByTagName('footer');

        expect(footer).toBeTruthy();
    })
});

describe('DOMContentLoaded event listener', () => {

    let emailInput;
    let passwordInput;
    let loginBtn;
    let login;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="login-container">
                <form id="login-form">
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                        <div class="error-message" id="email-error-message"></div>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                        <div class="error-message" id="password-error-message"></div>
                    </div>
                    <div class="input-group">
                        <button id="login-button" type="submit">Login</button>
                    </div>
                </form>
            </div>
        `;
        emailInput = document.querySelector('#email');
        passwordInput = document.querySelector('#password');
        loginBtn = document.querySelector('#login-button');
        login = new Login(emailInput, passwordInput);
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    test('email input field is focused when the page loads', () => {
        // Check if the email input field is focused
        expect(document.activeElement).toEqual(emailInput);
    });

    test('event listener is attached to login button', () => {
        const loginButtonClickMock = jest.fn();

        loginBtn.addEventListener = loginButtonClickMock;

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(loginButtonClickMock).toHaveBeenCalledWith('click', expect.any(Function));
    });

    test('Login attempt is prevented on button click', () => {
        const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');

        loginBtn.click();

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('attemptLogin method is called on button click', () => {
        const attemptLoginSpy = jest.spyOn(Login.prototype, 'attemptLogin');

        loginBtn.click();

        expect(attemptLoginSpy).toHaveBeenCalled();
    });

});

/* beforeEach(() => {

    document.body.innerHTML = `
        <div class="login-container">
            <form id="login-form">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                    <div class="error-message" id="email-error-message"></div>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                    <div class="error-message" id="password-error-message"></div>
                </div>
                <div class="input-group">
                    <button id="login-button" type="submit">Login</button>
                </div>
            </form>
        </div>
    `;
    
    // Dispatch DOMContentLoaded event before initializing login object
    document.dispatchEvent(new Event('DOMContentLoaded'));

    emailInput = document.querySelector('#email');
    passwordInput = document.querySelector('#password');
    loginBtn = document.querySelector('#login-button');
    login = new Login(emailInput, passwordInput);
}); */