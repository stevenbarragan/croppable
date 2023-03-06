import Cropper from 'cropperjs';

document.addEventListener('DOMContentLoaded', start)
document.addEventListener('turbo:render', start)

function start() {
  const input = document.querySelector('.croppable-input');
  const image = document.querySelector('.croppable-image');

  if (input) {
    input.addEventListener('change', setupCropperFromInput);
  }

  if (image) {
    setupCropperFromImage(image)
  }
}

function setupCropperFromInput(event) {
  const input      = event.target;
  const wrapper    = input.closest(".croppable-wrapper");

  const file  = input.files[0];
  const image = document.createElement('img');

  image.src = URL.createObjectURL(file);

  updateImageDisplay(image, wrapper, true, input)
}

function setupCropperFromImage(image) {
  const wrapper = image.closest(".croppable-wrapper");

  updateImageDisplay(image, wrapper, false, false)
}

function updateImageDisplay(image, wrapper, isNewImage, input) {
  const controls    = wrapper.querySelector(".croppable-controls");
  const container   = wrapper.querySelector(".croppable-container");
  const centerBtn   = wrapper.querySelector(".croppable-center");
  const fitBtn      = wrapper.querySelector(".croppable-fit");
  const deleteBtn   = wrapper.querySelector(".croppable-delete");
  const bgColorBtn  = wrapper.querySelector(".croppable-bgcolor");
  const xInput      = wrapper.querySelector(".croppable-x");
  const yInput      = wrapper.querySelector(".croppable-y");
  const scaleInput  = wrapper.querySelector(".croppable-scale");
  const deleteInput = wrapper.querySelector(".croppable-input-delete");
  const width       = wrapper.dataset.width;
  const height      = wrapper.dataset.height;

  cleanContainer()

  const cropper = new Cropper(image, {container, template: template(width, height)});

  const cropperImage  = cropper.getCropperImage();
  const cropperCanvas = cropper.getCropperCanvas();

  controls.style.display = "flex";

  var saveTransform = false;

  cropperImage.$ready(() => {
    if (xInput.value != "" && !isNewImage) {
      setTimeout(() => {
        cropperImage.$setTransform(+scaleInput.value, 0, 0, +scaleInput.value, +xInput.value, +yInput.value);

        saveTransform = true;
      })
    } else {
      const matrix     = cropperImage.$getTransform();
      xInput.value     = matrix[4];
      yInput.value     = matrix[5];
      scaleInput.value = matrix[0];

      saveTransform = true;
    }
  })

  cropperImage.addEventListener('transform', (event) => {
    if(saveTransform) {
      const matrix = event.detail.matrix;
      xInput.value     = matrix[4];
      yInput.value     = matrix[5];
      scaleInput.value = matrix[0];
    }
  });

  cropperCanvas.style.backgroundColor = bgColorBtn.value;

  bgColorBtn.addEventListener("change", (event) => {
    event.preventDefault();
    cropperCanvas.style.backgroundColor = event.target.value;
  })

  centerBtn.addEventListener("click", (event) => {
    event.preventDefault();
    cropperImage.$center('cover')
  })

  fitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    cropperImage.$center('contain')
  })

  deleteBtn.addEventListener("click", (event) => {
    event.preventDefault();

    deleteInput.checked = true;

    if (input) {
      input.value = "";
    }

    cleanContainer()

    controls.style.display = "none";
  })

  function cleanContainer() {
    while(container.firstChild) {
      container.removeChild(container.lastChild);
    }
  }
}

function template(width, height) {
  return `
<cropper-canvas style="height: ${height}px; width: ${width}px;">
  <cropper-image slottable></cropper-image>
  <cropper-handle action="move" plain></cropper-handle>
</cropper-canvas>
  `
}
