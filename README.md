# proper-build – a Docker image for running Proper Design's Gulp pipeline

## What it does

This image wraps up a pipeline that exposes the following Gulp tasks:

* sass – Sass/Compass compilation
* scripts – lints, concatenates and minifies site scripts
* svg – produces an SVG sprite
* bower-install – runs `bower install` from the bower.json in the project's root. Also runs main-bower-files to concatenate into a single thirdparty.min.js and thirdparty.min.css

## Using this image

### Configuration

The image has a built in configuration for file inputs and outputs based on Proper Design's [WordPress starter theme] (https://github.com/Bones5/Proper-Bear). To use your own configuration, take a copy of `proper-config-template.json`, rename to `proper-config.json` and drop it in the directory that you're going to be running `gulp` from.

### Docker run command

The image uses `gulp` at its entrypoint, meaning that running the image runs Gulp using your `proper-config.json`. If you want to run the default task in your current directory, run:

```
docker run --rm -ti -v $(PWD):/source --name proper-build properdesign/proper-build
```

To run any other task, e.g. sass, run:

```
docker run --rm -ti -v $(PWD):/source --name proper-build properdesign/proper-build sass
```

### Aliasing

Typing out all of that is a bit of a drag. You can make this less painful by adding something like this to your `.bash_profile`, `.bashrc` or whatever

```
export proper-build="docker run --rm -ti properdesign/proper-build"

```

## To-do

* BrowserSync. Not working yet, open issue on GitHub