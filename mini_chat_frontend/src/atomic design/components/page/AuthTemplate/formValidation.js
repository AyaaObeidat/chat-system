import { setupFullNameValidation } from '../../molecules/FormField/FullNameField/index.js';
import { setupEmailValidation } from '../../molecules/FormField/EmailField/index.js';
import { setupPasswordValidation } from '../../molecules/FormField/PasswordField/index.js';
import { setupConfirmPasswordValidation } from '../../molecules/FormField/ConfirmPasswordField/index.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - use registerForm to match HTML
    const registerForm = document.getElementById('registerForm');
    const submitButton = document.getElementById('submitButton');
    
    // Setup validation modules
    const { validateFullName, fullNameInput } = setupFullNameValidation();
    const { validateEmail, emailInput } = setupEmailValidation();
    const { validatePassword, passwordInput } = setupPasswordValidation();
    const { validateConfirmPassword, confirmPasswordInput } = setupConfirmPasswordValidation(passwordInput);
    
    // Track if form has been submitted at least once
    let hasSubmitted = false;
    
    // Activate real-time validation after first submission
    function activateRealTimeValidation() {
        if (!hasSubmitted) {
            fullNameInput?.addEventListener('input', validateFullName);
            fullNameInput?.addEventListener('blur', validateFullName);
            emailInput?.addEventListener('input', validateEmail);
            emailInput?.addEventListener('blur', validateEmail);
            passwordInput?.addEventListener('input', validatePassword);
            passwordInput?.addEventListener('blur', validatePassword);
            confirmPasswordInput?.addEventListener('input', validateConfirmPassword);
            confirmPasswordInput?.addEventListener('blur', validateConfirmPassword);
            hasSubmitted = true;
        }
    }
    
    // Form submission handler
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear any existing errors first
        const errorMessages = document.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(msg => msg.style.display = 'none');
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
        // Validate all fields
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        // Only validate confirm password if the field exists
        const isConfirmPasswordValid = confirmPasswordInput ? validateConfirmPassword() : true;
        
        if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // Form is valid - you can submit data to server here
            submitButton.disabled = true;
            submitButton.textContent = 'Signing up...'; // Changed to match "Sign Up"
            
            // Simulate API call
            setTimeout(() => {
                alert('Registration successful! (This is a demo)');
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
                registerForm.reset();
            }, 1500);
        } else {
            // Activate real-time validation after first failed submission
            activateRealTimeValidation();
        }
    });
});