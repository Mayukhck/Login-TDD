class Login {
    constructor(emailInput, passwordInput) {
        this.emailInput = emailInput;
        this.passwordInput = passwordInput;
        this.emailErrorMessage = document.getElementById('email-error-message');
        this.passwordErrorMessage = document.getElementById('password-error-message');
    }

    attemptLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        this.emailErrorMessage.innerHTML = '';
        this.passwordErrorMessage.innerHTML = '';

        if (email === '' || password === '') {
            this.emailErrorMessage.innerHTML = 'Email and password are required.';
            return;
        }

        if (!this.isValidEmail(email)) {
            this.emailErrorMessage.innerHTML = 'Please enter a valid email address.';
            return;
        }

        if (!this.isValidPassword(password)) {
            this.passwordErrorMessage.innerHTML = 'Please enter a valid password.';
            return;
        }

        this.handleSuccessfulLogin();
    }

    handleSuccessfulLogin() {
        this.navigateTo('https://www.google.com/');
    }

    navigateTo(url) {
        window.location.href = url;
    }


    isValidEmail(email) {
        const storedEmail = 'mayukhck@gmail.com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return storedEmail && emailRegex.test(email);
    }

    isValidPassword(password) {
        const storedPassword = 'Manu@123';
        return password === storedPassword;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        if (email !== '' && !this.isValidEmail(email)) {
            this.emailErrorMessage.innerHTML = 'Please enter a valid email address.';
        } else {
            this.emailErrorMessage.innerHTML = '';
        }
    }

    validatePassword() {
        const password = this.passwordInput.value.trim();
        if (password !== '' && !this.isValidPassword(password)) {
            this.passwordErrorMessage.innerHTML = 'Please enter a valid password.';
        } else {
            this.passwordErrorMessage.innerHTML = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const login = new Login(emailInput, passwordInput);

    emailInput.addEventListener('input', login.validateEmail.bind(login));
    passwordInput.addEventListener('input', login.validatePassword.bind(login));

    login.emailInput.focus();

    const loginBtn = document.querySelector('.input-group button');
    loginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        login.attemptLogin();
    });
});

module.exports = Login;