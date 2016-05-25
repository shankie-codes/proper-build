// Include gulp and plugins
var gulp = require('gulp'),
  watch = require('gulp-watch'),
  rename = require('gulp-rename'),
  bower = require('gulp-bower'),
  browserSync = require('browser-sync'),
  filter = require('gulp-filter'),
  plumber = require('gulp-plumber'),
  path = require('path'),
  config = require('/source/proper-config.json'),
  onError = function (err) {
    console.log(err);
    this.emit('end')
  },

// Assets
  mainBowerFiles = require('main-bower-files'),
  svgSprite = require('gulp-svg-sprite'),

// Scripts
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),

// Styles
  compass = require('gulp-compass'),
  minifyCSS = require('gulp-minify-css'),
  autoprefixer = require('gulp-autoprefixer');

module.exports = gulp;

// Accept SIGINT from Docker ctrl-c
process.on('SIGINT', function() {
    process.exit();
});

// We're only interested in the build object of proper-config.json
config = config.build;

var source = `/source/${config.source}/`

/**************
 * Assets
 **************/

// Bower task
gulp.task('bower-install', function() { 
  return bower({ cwd: source })
     .pipe(gulp.dest(config.bower.installDest)) 
});

// Concatenate and minify third-party Bower css using main-bower-files
gulp.task('bower-minify-css', ['bower-install'], function() {
  return gulp.src(mainBowerFiles({
      filter: new RegExp('.*css$', 'i'),
      paths: source
    }))
    .pipe(concat(config.bower.cssDestName))
    .pipe(gulp.dest(source + config.bower.cssDestDir))
    .pipe(rename(config.bower.cssMinDestName))
    .pipe(minifyCSS())
    .pipe(gulp.dest(source + config.bower.cssMinDestDir));
});

// Concatenate and minify third-party Bower scripts using main-bower-files
gulp.task('bower-minify-js', ['bower-minify-css'], function() {
  return gulp.src(mainBowerFiles({
      filter: new RegExp('.*js$', 'i'),
      paths: "/source/"
    }))
    .pipe(concat(config.bower.jsDestName))
    .pipe(gulp.dest(source + config.bower.jsDestDir))
    .pipe(rename(config.bower.jsMinDestName))
    .pipe(uglify())
    .pipe(gulp.dest(source + config.bower.jsMinDestDir));
});

gulp.task('bower', ['bower-install', 'bower-minify-js', 'bower-minify-css']);

// Concatenate SVGs
// for some reason this guy needs double quotes [It's because it's JSON - Ed.]
gulp.task('svg', function(){

  svgConfig = {
    "log": "verbose",
    "svg": {
      xmlDeclaration      : true,
      doctypeDeclaration  : true
    },
    "mode": {
      symbol: {
        sprite  : config.svg.destName,
        dest    : './'
      }
    }
  };

  return gulp.src(source + config.svg.srcDir + '**/*.svg')
  .pipe(svgSprite( svgConfig ))
  .pipe(gulp.dest(source + config.svg.destDir));
});

/**************
 * Scripts
 **************/

// Lint Task
gulp.task('lint', function() {
  return gulp.src([source + config.js.srcDir + '/**/*.js', '!' + source + config.js.srcDir + '/modernizr.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src([source + config.js.srcDir + '/**/*.js'])
    .pipe(plumber({
        errorHandler: onError
      }))
    .pipe(concat(config.js.destName))
    .pipe(gulp.dest(source + config.js.destDir))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(source + config.js.destDir));
});


/**************
 * Styles
 **************/

// Compile Our Sass/Compass
gulp.task('sass', function() {
  return gulp.src([source + config.sass.srcDir + '/**/*.scss'])
    .pipe(plumber({
        errorHandler: onError
      }))
    .pipe(compass({
      config_file: './config.rb',
      css: source + config.sass.destDir,
      sass: source + config.sass.srcDir
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./' + config.sass.destDir));

});


/**************
 * BrowserSync & Watcher
 **************/

// Browsersync
gulp.task('browser-sync', function() {
  browserSync({
    proxy: "localhost/groundwork",
    files: ["style.css", "*.js", "*.php", "*.html"]
  });
});

// Watch Files For Changes
gulp.task('watch', function(){
  watch(path.resolve(source + config.sass.srcDir + '/**/*.scss'), { usePolling: true, interval: 2000 }, function(file) {
      gulp.start('sass')
  });
  watch(path.resolve(source + config.js.srcDir + '/**/*.js'), { usePolling: true, interval: 2000 }, function(file) {
      gulp.start('lint');
      gulp.start('scripts');
  });
});

// Default without browser sync
gulp.task('_default_nosync', ['lint', 'sass', 'scripts', 'svg', 'watch']);


// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'svg', 'watch']);
