const app = document.querySelector('.app');
const title = process.env.VOTER_TITLE;
const images = JSON.parse(localStorage.getItem('images'));
const tyleImages = process.env.VOTER_TYPE_IMAGE;
const arrays = tyleImages.split(',');

// adding title
document.title = title;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

fetchData('./images.json')
  .then((data) => addToSiteImages(data))
  .then(createTitle)
  .then(setValueNumber)
  .then(createButtonSendEmail)
  .then(allImagesSelected);

function createTitle() {
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'title';
  titleWrapper.innerHTML = `<h1>${title}</h1>`;
  app.insertAdjacentElement('beforebegin', titleWrapper);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'group-button';

  titleWrapper.insertAdjacentElement('beforeend', buttonGroup);

  createButtons(buttonGroup);
}

const sizeButton = document.createElement('button');

function showSize(buttonGroup) {
  sizeButton.className = 'size-button';
  sizeButton.innerHTML = svgUse('size');
  buttonGroup.insertAdjacentElement('beforeend', sizeButton);
}

const showPhotos = document.createElement('button');

function showSelectedPhoto(buttonGroup) {
  showPhotos.className = 'show-images';
  showPhotos.innerHTML = svgUse('image');
  buttonGroup.insertAdjacentElement('beforeend', showPhotos);
}

function createButtons(buttonGroup) {
  const buttons = [
    {
      name: 'clear-base',
      svg: 'clear',
      title: process.env.VOTER_TITLE_CLEAR,
    },
    {
      name: 'size-button',
      svg: 'size',
      title: process.env.VOTER_TITLE_SHOW_SIZE_IMAGES,
    },
    {
      name: 'show-images',
      svg: 'image',
      title: process.env.VOTER_TITLE_SHOW_SELECTED_IMAGES,
    },
  ];
  buttons.map(({ name, svg, title }) => {
    let buttonElement = document.createElement('button');
    buttonElement.classList = name;
    buttonElement.title = title;
    buttonElement.innerHTML = svgUse(svg);
    buttonGroup.insertAdjacentElement('beforeend', buttonElement);
  });
}

function svgUse(name) {
  return `<svg><use xlink:href="#${name}"></use></svg>`;
}

function allImagesSelected() {
  const titleWrapper = document.querySelector('.title');
  const allImages = document.createElement('div');
  allImages.className = 'selected-images';

  titleWrapper.insertAdjacentElement('beforebegin', allImages);
}

function sizeImages(image) {
  return arrays
    .map(
      (type) => `
    <div id="image-number">
      <label>${type}</label>
      <input type="number" name="${type}-${image}" min="0"> szt.
    </div>`
    )
    .join('');
}

const template = (image) => {
  const imageSize = sizeImages(image);
  const temp = `
    <div class="item" id="${image}" data-image-name="${image.substring(
    image.indexOf('-') + 1
  )}">
      <img data-zooom-big="https://grzegorztomicki.pl/images/kilkudniowa-wycieczka/1200/${image}" loading="lazy" class="img-zoom" data-zoomed="false" width="1600px" height="1067px" src="https://grzegorztomicki.pl/images/kilkudniowa-wycieczka/576/${image}">
      <div class="number-images">
        <div class="image-name">${image}</div>
        ${imageSize}
      </div>
    </div>`;

  return temp;
};

function addToSiteImages(array) {
  array.forEach((item) => {
    app.insertAdjacentHTML('beforeend', template(item.image));
  });
}

window.addEventListener('DOMContentLoaded', function () {
  let arrayImages = localStorage.getItem('images')
    ? JSON.parse(localStorage.getItem('images'))
    : [];

  document.addEventListener('change', (e) => {
    if (e.target.type === 'number') {
      const { name, value } = e.target;
      const type = { name, value };

      let item = arrayImages.find((img) => img.name === name);

      if (item) {
        item.value = value;
      } else {
        arrayImages.push(type);
      }
    }

    localStorage.setItem('images', JSON.stringify(arrayImages));

    setToSelectedImages(arrayImages);
  });

  getAllInputsValue();

  setTimeout(() => {
    setToSelectedImages(arrayImages);
  }, 2000);
});

function setToSelectedImages(arrays) {
  let count = 0;

  const listOfImages = document.querySelector('.list-of-images');
  if (listOfImages) {
    listOfImages.parentNode.removeChild(listOfImages);
  }
  const selectedImages = document.querySelector('.selected-images');
  const ulList = document.createElement('ul');
  ulList.className = 'list-of-images';

  arrays.forEach((array) => {
    if (array.value !== '' && array.value !== '0') {
      ulList.innerHTML += `<li data-img="${array.name.replace(
        /.+\-/g,
        ''
      )}" class="img-element">${array.name} | ${array.value} szt.</li>`;
      count += parseInt(array.value);
    }
  });

  selectedImages.insertAdjacentElement('afterbegin', ulList);

  countElement(count);
}

function countElement(count) {
  const countImages = document.querySelector('.count-images');
  if (countImages) {
    countImages.parentNode.removeChild(countImages);
  }
  const showImages = document.querySelector('.show-images');
  const countElement = document.createElement('div');
  countElement.className = 'count-images';
  countElement.textContent = count;

  document.body.dataset.count = count;

  showImages.insertAdjacentElement('beforeend', countElement);
}

(function eventHandle() {
  document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.className === 'img-element') {
      const actives = document.querySelectorAll('.active');
      actives.forEach((activeImg) => {
        activeImg.classList.remove('active');
      });

      const imgID = event.target.dataset.img;
      const element = document.querySelector(`[data-image-name="${imgID}"]`);
      element.classList.add('active');
      event.target.classList.add('active');

      document.body.classList.remove('show-all-images');

      scroll({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }

    if (event.target.classList.contains('size-button')) {
      document.body.classList.toggle('show-numbers');
      event.target.classList.toggle('active');
    }

    if (event.target.classList.contains('show-images')) {
      const bodyCount = document.body.dataset.count;
      if (bodyCount > 0) {
        document.body.classList.toggle('show-all-images');
        event.target.classList.toggle('active');
      }
    }

    if (event.target.classList.contains('clear-base')) {
      event.target.classList.toggle('active');
      if (window.confirm(process.env.VOTER_CLEAR)) {
        localStorage.clear();
        location.reload();
      } else {
        event.target.classList.remove('active');
      }
    }
  });
})();

function getAllInputsValue() {
  let imagesList = [];
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('send-email')) {
      const inputs = document.querySelectorAll('input[type="number"]');

      inputs.forEach((input) => {
        if (input.value !== '' && input.value !== '0') {
          const type = input.name.split('-')[0];
          const name = input.name.substring(input.name.indexOf('-') + 1);

          const array = [name, type, input.value];
          // const name = input.name.split('-')[1];

          // const array = [name, type, input.value];
          imagesList.push(array);
        }
      });

      if (imagesList.length > 0) {
        sendEmail(imagesList);
      }
    }
    imagesList = [];
  });
}

function sendEmail(images) {
  let csvContent =
    'data:text/csv;charset=utf-8,' + images.map((e) => e.join(',')).join('\n');

  const hiddenElement = document.createElement('a');
  hiddenElement.href = encodeURI(csvContent);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'all_images.csv';
  hiddenElement.click();
}

function setValueNumber() {
  if (!images) return;
  images.forEach((image) => {
    let element = document.querySelector(`input[name="${image.name}"]`);
    element.value = image.value;
  });
}

function createButtonSendEmail() {
  const button = document.createElement('button');
  button.className = `send-email`;
  button.textContent = process.env.VOTER_GENERATE_CSV;
  app.insertAdjacentElement('afterend', button);
}

new Zooom('img-zoom', {
  cursor: {
    in: 'var(--zoom-in)',
    out: 'var(--zoom-out)',
  },
  overlay: 'rgba(237, 235, 231, 0.9)',
  onResize: function () {
    // we set the page width from which it will
    // be possible to click on the image
    let responsiveMin = 653;

    // we check the width of the browser window
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // we return the boolean value 'true/false'
    // the value 'true' blocks clicking the image
    const widthWindow = windowWidth < responsiveMin ? true : false;

    // I set different cursors depending on the width of the window
    const root = document.documentElement;
    root.style.setProperty('--zoom-in', widthWindow ? 'default' : 'zoom-in');
    root.style.setProperty('--zoom-out', widthWindow ? 'default' : 'zoom-out');

    return widthWindow;
  },
});
