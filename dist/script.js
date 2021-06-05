
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  const app = document.querySelector('.app');
  const local = true ;
  const api = "http://localhost:3000/images";
  const images = JSON.parse(localStorage.getItem('images'));
  const localStorageExist = localStorage.getItem('images');
  const tyleImages = "15x10,15x23";
  const arrays = tyleImages.split(',');

  const showImage = window.location.search === '?s=print' ? 'show' : '';

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return local ? data : data.images;
    } catch (err) {
      console.error(err);
    }
  }
  fetchData(api)
    .then(data => addToSiteImages(data))
    .then(setValueNumber)
    .then(createButtonSendEmail);


  function sizeImages(image) {
    return arrays.map(type => `
    <div class="15-18">
      <label>${type}</label>
      <input type="number" name="${type}-${image}" min="0"> szt.
    </div>`).join('')
  }

  const template = (image) => {
    const imgPath = image ;
    const imageSize = sizeImages(image);
    const temp = `
    <div class="item" data-image-name="${image}">
      <img loading="lazy" class="img-zoom" data-zoomed="false" width="1600px" height="1067px" src="${imgPath}">
      <div class="number-images ${showImage}">
        <div class="image-name">${image}</div>
        ${imageSize}
      </div>
    </div>`;

    return temp;
  };



  function addToSiteImages(data) {
    data.map(item => {
      app.insertAdjacentHTML('beforeend', template(item.image));
    });
  }
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
    });

    getAllInputsValue();

  });

  function getAllInputsValue() {
    let imagesList = '';
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('send-email')) {
        const inputs = document.querySelectorAll('input[type="number"]');

        inputs.forEach(input => {
          if (input.value !== '' && input.value !== '0') {
            const type = input.name.split('-')[0];
            const name = input.name.split('-')[1];
            imagesList += `${name} - ${type} | ${input.value} szt.` + '%20%0A';
          }
        });

        if (imagesList.length > 0) {
          sendEmail(imagesList);
        }
      }
      imagesList = '';
    });
  }

  function sendEmail(images) {
    const mail = "test@gmail.com";
    const mailtoLink = `mailto:${mail}?subject=Zdjęcia wybrane do druku&body=${images}`;
    const win = window.open(mailtoLink, 'mail');
    setTimeout(() => {
      win.close();
    }, 500);
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
    button.className += `send-email ${showImage}`;
    button.textContent = 'wyślij maila';
    app.insertAdjacentElement('beforeend', button);
  }

})));
//# sourceMappingURL=script.js.map
