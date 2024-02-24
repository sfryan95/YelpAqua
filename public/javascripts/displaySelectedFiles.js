// Function to display selected file names or count in a custom label
function displaySelectedFiles(input) {
  const fileList = input.files; // Get the list of selected files
  const customFileLabel = input.parentElement.querySelector('.form-file-label .form-file-text'); // Find the custom label element

  // Clear any previously displayed file names or count
  customFileLabel.innerHTML = '';

  // Update the label based on the number of files selected
  if (fileList.length === 0) {
    // No file selected: Show default text
    customFileLabel.textContent = 'Choose image(s)...';
  } else if (fileList.length === 1) {
    // One file selected: Show the file name
    customFileLabel.textContent = fileList[0].name;
  } else {
    // Multiple files selected: Show the number of files
    customFileLabel.textContent = `(${fileList.length}) files`;
  }
}
