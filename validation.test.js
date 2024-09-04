// validation.test.js

const { isEmailValid, isPhoneNumberValid } = require('./validation');

describe('Form Validation Tests', () => {
  test('Valid email passes validation', () => {
    expect(isEmailValid('test@example.com')).toBe(true);
  });

  test('Invalid email fails validation', () => {
    expect(isEmailValid('invalid-email')).toBe(false);
  });

  test('Valid phone number passes validation', () => {
    expect(isPhoneNumberValid('1234567890')).toBe(true);
  });

  test('Invalid phone number fails validation', () => {
    expect(isPhoneNumberValid('12345')).toBe(false);
  });
});
