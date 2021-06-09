const { readdir, writeFileSync } = require('fs');

const imagesDir = './sources/images';
const arrayImages = [];

readdir(`${imagesDir}`, function (err, files) {

  files.forEach((file, index) => {
    const path = {
      "id": index,
      "image": file
    };
    arrayImages.push(path);
  });

  const template = JSON.stringify({ images: arrayImages }, null, 2);

  writeFileSync('./sources/images.json', template, (err) => { });
});
