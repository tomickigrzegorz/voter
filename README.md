## VOTER

<img src="https://img.shields.io/github/package-json/v/tomik23/voter"> <img src="https://img.shields.io/badge/License-MIT-green.svg">

The site can be useful for photographers. You provide photos to the client who selects the size and number of photos for printing.

Selected photos can be generated to a csv file and sent to the photographer ;)

Everything is saved in localStorage, so even closing or refreshing the page does not remove the selected photos.

## Demo

See the demo - [example](https://tomik23.github.io/voter/)

## What you will need

The `images` folder with photos in the sources folder.
Photo list - `images.json`, see in the sources folder.  
The main folder there should also be configuration files: `.env`

```bash
# tiitle site
VOTER_TITLE=TRIP

# images sizes
VOTER_TYPE_IMAGE=15x10,15x23

# remove localStorage
VOTER_CLEAR=Czy napewno chcesz usunąć zaznaczone zdjęcia?

# generate svg button
VOTER_GENERATE_CSV=generuj csv ze zdjęciami

# all byttons title
VOTER_TITLE_CLEAR=Wyczyść wszystkie zdjęcia
VOTER_TITLE_SHOW_SIZE_IMAGES=Pokaż wielkości zdjęć
VOTER_TITLE_SHOW_SELECTED_IMAGES=Pokaż wybrane zdjęcia
```

## Clone the repo and install dependencies

```bash
git clone https://github.com/tomik23/voter.git
cd VOTER
yarn
# or
npm i
```

## Watch/Build the app

Watch the app, just call:

```bash
yarn dev
# or
npm run dev
```

Build app:

```bash
yarn prod
# or
npm run prod
```

## How to generate json file with images

```bash
yarn json
# or
npm run json
```
