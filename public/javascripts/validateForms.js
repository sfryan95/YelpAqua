(function () {
  'use strict'; // Enable strict mode for JavaScript

  // Select all forms with the 'validated-form' class
  const forms = document.querySelectorAll('.validated-form');

  // Iterate over the selected forms to apply custom validation
  Array.from(forms).forEach(function (form) {
    // Add a 'submit' event listener to each form
    form.addEventListener(
      'submit',
      function (event) {
        // Prevent form submission if it doesn't pass the validation checks
        if (!form.checkValidity()) {
          event.preventDefault(); // Prevent form submission
          event.stopPropagation(); // Stop propagation of the event
        }
        // Add 'was-validated' class to the form for Bootstrap styles
        form.classList.add('was-validated');
      },
      false // Use event bubbling for event propagation
    );
  });
})();
