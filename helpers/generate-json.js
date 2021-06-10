const { readdir, writeFileSync } = require('fs');

const imagesDir = './sources/images';
const arrayImages = [];

readdir(`${imagesDir}`, function (err, files) {

  files.forEach((file, index) => {
    const checkFile = file.split('.')[1];
    if (checkFile === 'jpg') {
      const path = {
        "id": index,
        "image": file
      };
      arrayImages.push(path);
    }
  });

  const template = JSON.stringify(arrayImages);

  writeFileSync('./sources/images.json', template, (err) => { });
});
