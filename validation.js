// validation.js

function isEmailValid(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function isPhoneNumberValid(phoneNumber) {
  const re = /^\d{10}$/;
  return re.test(String(phoneNumber));
}

function validateForm() {
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  if (!isEmailValid(email)) {
    alert("Invalid email address.");
    return false;
  }

  if (!isPhoneNumberValid(phoneNumber)) {
    alert("Invalid phone number.");
    return false;
  }

  // Add more validation checks here...

  return true;
}

// For testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isEmailValid, isPhoneNumberValid };
}
