import { InputController } from '../../../atoms/Input/index.js';

export function setupFullNameValidation() {
  const fullNameElement = document.getElementById('fullName');

  if (!fullNameElement) {
    return {
      validateFullName: () => true,
      controller: null
    };
  }

  const controller = new InputController(fullNameElement);
  const field = fullNameElement.closest('[data-fullname-field]');
  const errorElement = field?.querySelector('.invalid-feedback');

  const WORD_SEPARATOR_REGEX = /\s+/; 
  const MINIMUM_WORD_COUNT = 2; 

  fullNameElement.addEventListener('input', validateFullName);
  fullNameElement.addEventListener('blur', validateFullName);

  function validateFullName() {
    const value = controller.getValue().trim();

    hideError();

    if (!value) {
      showError('Full name is required');
      controller.setValid(false);
      return false;
    }

    const nameParts = value.split(WORD_SEPARATOR_REGEX);
    if (nameParts.length < MINIMUM_WORD_COUNT) {
      showError('Please enter at least first and last name');
      controller.setValid(false);
      return false;
    }

    controller.setValid(true);
    return true;
  }

  function showError(message) {
    field?.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  function hideError() {
    field?.classList.remove('error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  function cleanup() {
    fullNameElement.removeEventListener('input', validateFullName);
    fullNameElement.removeEventListener('blur', validateFullName);
  }

  return {
    validateFullName,
    controller,
    cleanup 
  };
}