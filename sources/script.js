const app = document.querySelector('.app');
const local = process.env.WYBORNIK_LOCAL === 'TRUE' ? true : false;
const api = process.env.WYBORNIK_API;
const title = process.env.WYBORNIK_TITLE;
const images = JSON.parse(localStorage.getItem('images'));
const localStorageExist = localStorage.getItem('images');
const tyleImages = process.env.WYBORNIK_TYPE_IMAGE;
const arrays = tyleImages.split(',');

// adding title
document.title = title;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return local ? data : data.images;
  } catch (err) {
    console.error(err);
  }
};

fetchData(api)
  .then(data => addToSiteImages(data))
  .then(createTitle)
  .then(setValueNumber)
  .then(createButtonSendEmail)
  .then(allImagesSelected)


function createTitle() {
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'title';
  titleWrapper.innerHTML = `<h1>${title}</h1>`;
  app.insertAdjacentElement('beforebegin', titleWrapper);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'group-button';

  titleWrapper.insertAdjacentElement('beforeend', buttonGroup);

  showSize(buttonGroup);
  showSelectedPhoto(buttonGroup);
}

function showSize(buttonGroup) {
  const sizeButton = document.createElement('button');
  sizeButton.className = 'size-button';
  sizeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 4h-4V0h-4v4h-4v4h4v4h4V8h4z"/><path d="M26.996 13.938c.576.64 1.1 1.329 1.563 2.062a15.223 15.223 0 01-4.67 4.697C21.527 22.204 18.799 23 16 23s-5.527-.796-7.889-2.303A15.212 15.212 0 013.441 16a15.223 15.223 0 015.041-4.925A8 8 0 1024 13.812l-.001-.065a8.003 8.003 0 01-5.998-7.635A17.877 17.877 0 0016 5.999c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10a18.386 18.386 0 00-1.958-3.095 7.952 7.952 0 01-3.046 1.034zM13 10a3 3 0 110 6 3 3 0 010-6z"/></svg>';
  buttonGroup.insertAdjacentElement('beforeend', sizeButton);

  sizeButton.addEventListener('click', () => {
    document.body.classList.toggle('show-numbers');
  })
}

function showSelectedPhoto(buttonGroup) {
  const showPhotos = document.createElement('button');
  showPhotos.className = 'show-images';
  showPhotos.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12 26h20v4H12zm0-12h20v4H12zm0-12h20v4H12zM6 0v8H4V2H2V0zM4 16.438v1.563h4v2H2v-4.563l4-1.875V12H2v-2h6v4.563zM8 22v10H2v-2h4v-2H2v-2h4v-2H2v-2z"/></svg>';
  buttonGroup.insertAdjacentElement('beforeend', showPhotos);

  showPhotos.addEventListener('click', () => {
    const bodyCount = document.body.dataset.count;
    if (bodyCount > 0) {
      document.body.classList.toggle('show-all-images');
    }
  })
}

function allImagesSelected() {
  const titleWrapper = document.querySelector('.title');
  const allImages = document.createElement('div');
  allImages.className = 'selected-images';

  titleWrapper.insertAdjacentElement('beforebegin', allImages);
}

function sizeImages(image) {
  return arrays.map(type => `
    <div id="image-number">
      <label>${type}</label>
      <input type="number" name="${type}-${image}" min="0"> szt.
    </div>`).join('')
}

const template = (image) => {
  const imgPath = `images/${image}`;
  const imageSize = sizeImages(image);
  const temp = `
    <div class="item" id="${image}" data-image-name="${image}">
      <img loading="lazy" class="img-zoom" data-zoomed="false" width="1600px" height="1067px" src="${imgPath}">
      <div class="number-images">
        <div class="image-name">${image}</div>
        ${imageSize}
      </div>
    </div>`;

  return temp;
}



function addToSiteImages(data) {
  data.map(item => {
    app.insertAdjacentHTML('beforeend', template(item.image))
  })
};

window.addEventListener('DOMContentLoaded', function () {
  new Zooom('img-zoom', {
    overlay: {
      color: '#edebe7',
      opacity: 90,
    },
  });

  let arrayImages = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [];

  document.addEventListener('change', (e) => {
    if (e.target.type === 'number') {
      const { name, value } = e.target;
      const type = { name, value };

      let item = arrayImages.find(img => img.name === name);

      if (item) {
        item.value = value;
      } else {
        arrayImages.push(type);
      }
    }

    localStorage.setItem('images', JSON.stringify(arrayImages));

    setToSelectedImages(arrayImages);
  })

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

  arrays.forEach(array => {
    if (array.value !== '' && array.value !== '0') {
      ulList.innerHTML += `<li data-img="${array.name.replace(/.+\-/g, '')}" class="img-element">${array.name} | ${array.value} szt.</li>`;
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
  countElement.className = 'count-images'
  countElement.textContent = count;

  document.body.dataset.count = count;

  showImages.insertAdjacentElement('beforeend', countElement);

  eventHandle();
}

function eventHandle() {
  document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.className === 'img-element') {

      const actives = document.querySelectorAll('.active');
      actives.forEach(activeImg => {
        activeImg.classList.remove('active');
      })

      const imgID = event.target.dataset.img;
      const element = document.querySelector(`[data-image-name="${imgID}"]`);
      element.classList.add('active');
      event.target.classList.add('active');



      document.body.classList.remove('show-all-images');

      scroll({
        top: element.offsetTop,
        behavior: "smooth"
      });
    }
  })
}

function getAllInputsValue() {
  // let imagesList = '';
  let imagesList = [];
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('send-email')) {
      const inputs = document.querySelectorAll('input[type="number"]');

      inputs.forEach(input => {
        if (input.value !== '' && input.value !== '0') {
          const type = input.name.split('-')[0];
          const name = input.name.split('-')[1];

          const array = [name, type, input.value];
          imagesList.push(array);
        }
      });

      if (imagesList.length > 0) {
        sendEmail(imagesList);
      }
    }
    imagesList = [];
  })
}

function sendEmail(images) {
  let csvContent = "data:text/csv;charset=utf-8,"
    + images.map(e => e.join(",")).join("\n");

  const hiddenElement = document.createElement('a');
  hiddenElement.href = encodeURI(csvContent);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'wszystkie_zdjecia.csv';
  hiddenElement.click();
}

function setValueNumber() {
  if (!localStorageExist) return;

  images.forEach(image => {
    let element = document.querySelector(`input[name="${image.name}"]`);
    element.value = image.value;
  });
}

function createButtonSendEmail() {
  const button = document.createElement('button');
  button.className = `send-email`;
  button.textContent = 'generuj plik ze zdjęciami'
  app.insertAdjacentElement('beforeend', button);
}
