const inpFile = document.querySelector('.file-input');
const chooseImage = document.querySelector('.choose-img');
const previewImage = document.querySelector('.preview-img img');
const container = document.querySelector('.container');
const filterName = document.querySelector('.slider p.name');
const inpRange = document.querySelector('input[type="range"]');
const filterValue = document.querySelector('.slider p.value');
const rotateButtons = document.querySelectorAll('.rotate button');
const resetImage = document.querySelector('.reset-filter');
const saveImage = document.querySelector('.save-img');
const filterOptions = document.querySelectorAll('.filter button');
const blurSlider = document.querySelector("#blurRange");
const rotateSlider = document.querySelector("#rotateRange");
const sepiaSlider = document.querySelector("#sepiaRange");
const flipButton = document.querySelector("#flip");

let brightness = 100, saturate = 100, inversion = 0, grayscale = 0, rotate = 0, horizontal = 1, vertical = 1;
let blurValue = 0;
let sepiaValue = 0;
let isFlipped = false;


// Load Image
inpFile.addEventListener('change', function () {
    let file = this.files[0];
    if (!file) return;
    let fileURL = URL.createObjectURL(file);
    previewImage.src = fileURL;
    container.classList.remove('disable');
});

// Choose Image Button
chooseImage.addEventListener('click', () => inpFile.click());

// Apply Filter
function applyFilteronImg() {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${horizontal},${vertical})`;
    previewImage.style.filter = `
        brightness(${brightness}%)
        saturate(${saturate}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
        blur(${blurValue}px)
        sepia(${sepiaValue}%)
    `;
}

// Filter Selection
filterOptions.forEach(option => {
    option.addEventListener('click', function () {
        document.querySelector('.filter .active')?.classList.remove('active');
        option.classList.add('active');
        filterName.innerText = option.innerText;
        inpRange.max = 200;

        if (option.id === 'brightness') inpRange.value = brightness;
        if (option.id === 'saturation') inpRange.value = saturate;
        if (option.id === 'inversion') inpRange.value = inversion;
        if (option.id === 'grayscale') inpRange.value = grayscale;
        filterValue.innerText = inpRange.value + "%";
    });
});

// Update Filter Value on Range Change
inpRange.addEventListener('input', function () {
    filterValue.innerText = inpRange.value + "%";
    let selectedFilter = document.querySelector('.filter .active');

    if (selectedFilter.id === 'brightness') brightness = inpRange.value;
    if (selectedFilter.id === 'saturation') saturate = inpRange.value;
    if (selectedFilter.id === 'inversion') inversion = inpRange.value;
    if (selectedFilter.id === 'grayscale') grayscale = inpRange.value;

    applyFilteronImg();
});

// Reset Filters
resetImage.addEventListener('click', function () {
    brightness = 100;
    saturate = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    horizontal = 1;
    vertical = 1;

    inpRange.value = brightness;
    filterValue.innerText = brightness + "%";
    applyFilteronImg();
});

// Rotate & Flip
rotateButtons.forEach(button => {
    button.addEventListener('click', function () {
        if (button.id === 'left') rotate -= 90;
        if (button.id === 'right') rotate += 90;
        if (button.id === 'horizontal') horizontal *= -1;
        if (button.id === 'vertical') vertical *= -1;
        applyFilteronImg();
    });
});

saveImage.addEventListener("click", function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Set canvas size equal to the preview image
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;

    // Apply transformations (rotation, flipping)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(horizontal, vertical);
    
    // Apply filters
    ctx.filter = `
        brightness(${brightness}%)
        saturate(${saturate}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
    `;

    // Draw the image on the canvas
    ctx.drawImage(
        previewImage,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
    );

    // Create a download link
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL(); // Convert canvas to image
    link.click(); // Auto-trigger download
});

blurSlider.addEventListener("input", function () {
    blurValue = blurSlider.value;
    applyFilteronImg();
});

rotateSlider.addEventListener("input", function () {
    rotate = rotateSlider.value;
    applyFilteronImg();
});

sepiaSlider.addEventListener("input", function () {
    sepiaValue = sepiaSlider.value;
    applyFilteronImg();
});


    
