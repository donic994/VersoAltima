var fileInput = document.querySelector('input[type=file]');
var filenameContainer = document.querySelector('#fileName');

fileInput.addEventListener('change', function () {
    filenameContainer.innerText = 'Selected file: ' + fileInput.value.split('\\').pop();
});