// Include gulp and plugins
var gulp = require('gulp'),
  watch = require('gulp-watch');
  rename = require('gulp-rename'),
  bower = require('gulp-bower'),
  browserSync = require('browser-sync'),
  filter = require('gulp-filter'),
  plumber = require('gulp-plumber'),
  path = require('path'),
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


/**************
 * Assets
 **************/

// Bower task
gulp.task('bower-pull', function() { 
  return bower({ cwd: '/source' })
     .pipe(gulp.dest('bower_components/')) 
});

// Concatenate and minify third-party Bower css using main-bower-files
gulp.task('bower-minify-css', ['bower-pull'], function() {
  return gulp.src(mainBowerFiles({
      filter: new RegExp('.*csss$', 'i'),
      paths: "/source/"
    }))
    .pipe(concat('thirdparty.css'))
    .pipe(gulp.dest('/source/_/css/'))
    .pipe(rename('thirdparty.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('/source/_/css/'));
});

// Concatenate and minify third-party Bower scripts using main-bower-files
gulp.task('bower-minify-js', ['bower-minify-css'], function() {
  return gulp.src(mainBowerFiles({
      filter: new RegExp('.*js$', 'i'),
      paths: "/source/"
    }))
    .pipe(concat('thirdparty.js'))
    .pipe(gulp.dest('/source/_/js'))
    .pipe(rename('thirdparty.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('/source/_/js'));
});

gulp.task('bower', ['bower-pull', 'bower-minify-js', 'bower-minify-css']);

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
        sprite  : "svg/symbols.svg",
        dest    : './'
      }
    }
  };

  return gulp.src('/source/_/svg/src/**/*.svg')
  .pipe(svgSprite( svgConfig ))
  .pipe(gulp.dest('/source/_/'));
});

/**************
 * Scripts
 **************/

// Lint Task
gulp.task('lint', function() {
  return gulp.src(['/source/_/js/src/map.js', '/source/_/js/src/themefunctions.js' ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(['/source/_/js/src/**/*.js'])
    .pipe(plumber({
        errorHandler: onError
      }))
    .pipe(concat('themefunctions.js'))
    .pipe(gulp.dest('/source/_/js/'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('/source/_/js/'));
});


/**************
 * Styles
 **************/

// Compile Our Sass/Compass
gulp.task('sass', function() {
  return gulp.src('/source/_/scss/**/*.scss')
    .pipe(plumber({
        errorHandler: onError
      }))
    .pipe(compass({
      config_file: '/gulp/config.rb',
      css: '/source',
      sass: '/source/_/scss'
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./'));

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
  watch(path.resolve('/source/_/scss/**/*.scss'), { usePolling: true, interval: 2000 }, function(file) {
      gulp.start('sass')
  });
  watch(path.resolve('/source/_/js/src/**/*.js'), { usePolling: true, interval: 2000 }, function(file) {
      gulp.start('lint');
      gulp.start('scripts');
  });
});

//gulp.task('sass-watch', function () {
//  watch({ glob: '/source/_/scss/**/*.scss' }); // Run 'lint' task for those files
//});

// Default without browser sync
gulp.task('_default_nosync', ['lint', 'sass', 'scripts', 'svg', 'watch']);


// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'svg', 'watch', 'browser-sync']);
gulp.task('default', ['sass']);